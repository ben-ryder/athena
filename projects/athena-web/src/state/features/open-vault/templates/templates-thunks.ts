import {v4 as createUUID} from "uuid";
import {AppThunkDispatch} from "../../../store";
import {createTemplate, updateTemplate} from "./templates-actions";


export function createNewTemplate(name: string) {
  return (dispatch: AppThunkDispatch) => {
    const templateId = createUUID();
    const timestamp = new Date().toISOString();

    const template = {
      id: templateId,
      name: name,
      body: "",
      folderId: null,
      targetFolderId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(createTemplate(template))
  }
}

export function renameTemplate(templateId: string, newName: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTemplate({
      id: templateId,
      changes: {
        name: newName,
        updatedAt: timestamp
      }
    }));
  }
}

export function moveTemplate(templateId: string, newFolder: string | null) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTemplate({
      id: templateId,
      changes: {
        folderId: newFolder,
        updatedAt: timestamp
      }
    }));
  }
}

export function updateTemplateBody(templateId: string, newBody: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTemplate({
      id: templateId,
      changes: {
        body: newBody,
        updatedAt: timestamp
      }
    }));
  }
}
