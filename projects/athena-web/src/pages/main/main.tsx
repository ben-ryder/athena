import React, {useEffect, useState} from 'react';
import {IconButton, iconColorClassNames, iconSizes, MultiSelect} from "@ben-ryder/jigsaw";
import {
  StickyNote as NotesIcon,
  Tag as TagsIcon,
  Filter as QueriesIcon,
  ArrowLeft as BackIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  X as CloseIcon
} from "lucide-react";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {useAthena} from "../../helpers/use-athena";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {NoteContentDto, VaultDto} from "@ben-ryder/athena-js-lib";

const notes: NoteContentDto[] = [
  {
    title: "test note 1",
    body: "test note 1"
  },
  {
    title: "test note 2",
    body: "test note 2"
  },
  {
    title: "test note 3",
    body: "test note 3"
  },
  {
    title: "test note 4",
    body: "test note 5"
  },
  {
    title: "test note 5",
    body: "test note 5"
  },
  {
    title: "test note 6",
    body: "test note 6"
  },
  {
    title: "test note 7",
    body: "test note 7"
  },
  {
    title: "test note 8",
    body: "test note 8"
  },
  {
    title: "test note 9",
    body: "test note 9"
  },
  {
    title: "test note 10",
    body: "test note 10"
  },
]

const tags = [
  {
    name: "tag 1",
    value: "1"
  },
  {
    name: "tag 2",
    value: "2"
  },
  {
    name: "tag 3",
    value: "3"
  },
  {
    name: "tag 4",
    value: "4"
  },
  {
    name: "tag 5",
    value: "5"
  }
]

const selectedTags = [tags[0], tags[3], tags[4]]

/**
 * This height is used to ensure that the logo, vault details, vault switcher and the note header all line up.
 */
const topSectionHeight = "h-[40px]";
const topSectionWidth = "w-[40px]";

type VaultSections = "notes" | "tasks" | "queries" | "tags";

export function MainPage() {
  const navigate = useNavigate();
  const {vaultId} = useParams();

  const {apiClient, setCurrentUser} = useAthena();
  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [pageErrorMessage, setPageErrorMessage] = useState<string|null>(null);

  const [vault, setVault] = useState<VaultDto|null>(null);
  const [currentVaultSection, setCurrentVaultSection] = useState<VaultSections>("notes");

  useEffect(() => {
    async function getVault() {
      if (!vaultId) {
        setStatus(GeneralQueryStatus.FAILED);
        return;
      }

      try {
        const vault = await apiClient.getVault(vaultId);
        setStatus(GeneralQueryStatus.SUCCESS);
        setVault(vault);
      }
      catch (e: any) {
        setStatus(GeneralQueryStatus.FAILED);

        if (e.response?.statusCode === 404) {
          setPageErrorMessage("The vault you requested does not exist.")
        }
        else if (e.response?.statusCode === 400) {
          setPageErrorMessage("You appear to be requesting a vault with an invalid ID.")
        }
        else {
          setPageErrorMessage("An unexpected error occurred while fetching the vault, try again later.");
        }
      }
    }
    getVault();
  }, [vaultId]);

  if (!vault) {
    return (
      <>
        <Helmet>
          <title>Loading Vault... | Athena</title>
        </Helmet>
        <LoadingPage
          hideHeader={true}
          status={status}
          loadingMessage="Loading vault..."
          errorMessage={pageErrorMessage || "An unepxected error occured"}
          emptyMessage="An unexpected error occurred"
        />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${vault.name} | Athena`}</title>
      </Helmet>
      <div className="min-h-[100vh] bg-br-atom-700 flex">

        {/** Left Panel (Account Menu & Vault Panel) **/}
        <div id="left-panel" className="min-h-[100vh] flex">

          {/** Vault Panel **/}
          <section className="flex flex-col w-[400px] bg-br-atom-900">

            {/** Vault Details **/}
            <div className={`flex justify-center items-center relative ${topSectionHeight}`}>
              <IconButton
                label="Back to vaults"
                icon={<BackIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {
                  navigate(routes.vaults.list)
                }}
                className="absolute left-[0.5rem] py-2"
              />
              <p className="text-br-whiteGrey-100 font-bold py-2">{vault.name}</p>
            </div>

            {/** Vault Panel Switcher **/}
            <div className={`flex ${topSectionHeight}`}>
              <IconButton
                label="Notes"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <NotesIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Notes</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("notes")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "notes",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "notes"
                  }
                )}
              />
              <IconButton
                label="Queries"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <QueriesIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Queries</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("queries")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "queries",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "queries"
                  }
                )}
              />
              <IconButton
                label="Tags"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <TagsIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Tags</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("tags")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "tags",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "tags"
                  }
                )}
              />
            </div>

            {/** Vault Panel Content **/}
            <div className="">
              {notes.map(note => (
                <div key={note.title}>
                  <button className="p-4 w-full text-br-whiteGrey-200 hover:bg-br-atom-600 text-left">{note.title}</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div id="main-panel" className="w-full min-h-[100vh] flex flex-col">
          <section id="note-details" className="bg-br-atom-800">
            <div className={`${topSectionHeight} flex items-stretch`}>
              <input className="grow block bg-transparent py-2 px-4 outline-none text-br-whiteGrey-100 font-bold" placeholder="note title here..." />
              <IconButton label="Delete Note" icon={<DeleteIcon />} className={`${iconColorClassNames.secondary} h-full ${topSectionWidth} flex justify-center items-center`} onClick={() => {}} />
              <IconButton label="Save Note" icon={<SaveIcon />} className={`${iconColorClassNames.secondary} h-full ${topSectionWidth} flex justify-center items-center`} onClick={() => {}} />
            </div>
            <div className={`${topSectionHeight}`}>
              <MultiSelect
                id="note-tags"
                label="Note Tags"
                hideLabel={true}
                placeholder="add tags..."
                options={tags}
                currentOptions={selectedTags}
                onOptionsChange={() => {}}
                className="border-none bg-transparent"
              />
            </div>
          </section>
          <section id="note-content" className="grow">

          </section>
          <section id="bottom-panel" className={`${topSectionHeight} bg-br-atom-800 flex justify-between items-center py-2 px-4`}>
            <p className="text-br-whiteGrey-700 text-center italic">42 words | 526 chars</p>
            <p className="text-br-whiteGrey-700 text-center italic">Online</p>
          </section>
        </div>
      </div>
    </>
  );
}

