import { useEffect, useRef, useState } from "react";
import { JButton, JCallout, JInput } from "@ben-ryder/jigsaw-react";
import { blobDatabase, BlobDto } from "../../state/database/attatchments/attachments";

import "./blob-test.scss"

export interface FileRender {
  name: string
  mimeType: string
  src: string
}

export function BlobTest() {
  // @ts-ignore
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [storageMessage, setStorageMessage] = useState<string>("Calculating storage info..")
  const [files, setFiles] = useState<FileRender[]>([])

  async function save() {
    if (fileInputRef.current?.files) {
      const files = fileInputRef.current.files

      if (files.length > 0) {
        const file = files.item(0)
        const fileContent = await file.arrayBuffer()

        const blob: BlobDto = {
          id: self.crypto.randomUUID(),
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          data: fileContent
        }

        blobDatabase.blobs.add(blob)
      }
    }

    // refresh blobs when adding new file
    loadBlobs()
  }

  async function loadBlobs() {
    const blobs = await blobDatabase.blobs.toArray()

    const files: FileRender[] = []
    for (const blobData of blobs) {
      const blob = new Blob([blobData.data], {type: blobData.mimeType})
      const renderUrl = URL.createObjectURL(blob)

      files.push({
        name: blobData.filename,
        src: renderUrl,
        mimeType: blobData.mimeType
      })
    }

    setFiles(files)
  }

  // Load all blobs as files
  useEffect(() => {
    loadBlobs()
  }, [])

  // Calculate storage info, recalculate when files change
  useEffect(() => {
    function formatMB(size: number): string {
      return (size / 1024 / 1024).toFixed(2) + "MB"
    }

    async function calculateStorage() {
      const storageData = await navigator.storage.estimate()
      setStorageMessage(`Using ${formatMB(storageData.usage)} of ${formatMB(storageData.quota)}`)
    }
    calculateStorage()
  }, [files])

  const fileElements = []
  for (const file of files) {
    if (file.mimeType.startsWith("image/")) {
      fileElements.push(
        <img key={file.src} src={file.src} alt="" />
      )
    }
    else if (file.mimeType.startsWith("audio/")) {
      fileElements.push(
        <audio controls key={file.src} src={file.src} />
      )
    }
    else if (file.mimeType.startsWith("video/")) {
      fileElements.push(
        <video controls key={file.src} src={file.src} />
      )
    }
    else {
      fileElements.push(
        <p>Attempted to render unsupported file {file.src} with mime type {file.mimeType}</p>
      )
    }
  }

  return (
    <div className="blob-test">
      <JInput
        ref={fileInputRef}
        type="file"
        id="upload"
        name="upload"
        accept=".png, .jpeg, .jpg, .mp4, .mp3, .m4a"
      />
      <JButton onClick={save}>Save</JButton>

      <p>{storageMessage}</p>

      <div className="blob-test__files">
        {fileElements}
      </div>
    </div>
  )
}