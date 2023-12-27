import { useEffect, useRef, useState } from "react";
import { JButton, JCallout, JInput } from "@ben-ryder/jigsaw-react";
import { blobDatabase, BlobDto } from "../../state/data/current-vault/attachments/attachments";

import "./attachments-manager.scss"

export interface FileRender {
  name: string
  mimeType: string
  src: string
}

export type StorageStatus = 'done' | 'in-progress' | 'required'

export function AttachmentsManagerPage() {
  // @ts-ignore
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [storageMessage, setStorageMessage] = useState<string>("Calculating storage info..")
  const [files, setFiles] = useState<FileRender[]>([])
  const [storageStatus, setStorageStatus] = useState<StorageStatus>("done")

  async function save() {
    if (fileInputRef.current?.files) {
      const files = fileInputRef.current.files

      if (files.length > 0) {
        const file = files.item(0)

        if (file) {
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

  async function processStorageSetup() {
    setStorageStatus("in-progress")

    const isSetup = await navigator.storage.persist()
    setStorageStatus(isSetup ? "done" : "required")
  }

  // Load all blobs as files
  useEffect(() => {
    loadBlobs()

    async function checkStorageSetup() {
      const isSetup = await navigator.storage.persisted()
      setStorageStatus(isSetup ? "done" : "required")
    }
    checkStorageSetup()
  }, [])

  // Calculate storage info, recalculate when files change
  useEffect(() => {
    function formatMB(size: number): string {
      return (size / 1024 / 1024).toFixed(2) + "MB"
    }

    async function calculateStorage() {
      const storageData = await navigator.storage.estimate()

      if (storageData.usage && storageData.quota) {
        setStorageMessage(`Using ${formatMB(storageData.usage)} of ${formatMB(storageData.quota)}`)
      }
      else {
        setStorageMessage(`Failed to retrieve storage usage & quota status.`)
      }
    }
    calculateStorage()
  }, [files, storageStatus])

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
    <div className="attachments-manager">
      {storageStatus !== "done" &&
        <JCallout variant="warning">
          <p>This app requires your consent to <em>"store data in persistent storage"</em>. This is required because browsers have a feature called{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#when_is_data_evicted">data eviction</a>,{" "}
            which on rare occasions may automatically delete saved data if your device is low on storage, if you haven't used the website in a while etc.<br/>
            Allowing persistent storage ensures that the browser will not automatically delete data from this app.
          </p>
          <JButton variant="secondary" disabled={storageStatus === "in-progress"} loading={storageStatus === "in-progress"} onClick={processStorageSetup}>Allow Persistent Storage</JButton>
        </JCallout>
      }

      <JInput
        label="Upload File"
        ref={fileInputRef}
        type="file"
        id="upload"
        name="upload"
        accept=".png, .jpeg, .jpg, .mp4, .mp3, .m4a"
      />
      <JButton onClick={save}>Save</JButton>

      <p>{storageMessage}</p>

      <div className="attachments-manager__files">
        {fileElements}
      </div>
    </div>
  )
}