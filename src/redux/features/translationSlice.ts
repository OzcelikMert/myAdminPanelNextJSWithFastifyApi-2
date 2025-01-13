import { PanelLanguageCodes } from '@constants/panelLanguages';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ILanguageKeys } from 'types/constants/languageKeys';

export interface ITranslationState {
  langCode: PanelLanguageCodes;
  isLoading: boolean;
  resources: { [key: string]: string };
}

export type ITranslationFunc = (key: ILanguageKeys) => string;

const initialState: ITranslationState = {
  langCode: PanelLanguageCodes.EnglishUS,
  isLoading: true,
  resources: {},
};

export const fetchTranslationState = createAsyncThunk(
  'translation/fetchTranslationState',
  async (langCode: PanelLanguageCodes) => {
    const response = await fetch(`/languages/${langCode}.json`);
    const resources = await response.json();
    return { langCode, resources };
  }
);

const translationSlice = createSlice({
  name: 'translationState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTranslationState.pending, (state) => {
      state.isLoading = true;
    });
    builder
      .addCase(fetchTranslationState.fulfilled, (state, action: PayloadAction<Omit<ITranslationState, "isLoading">>) => {
        state.isLoading = false;
        state.resources = action.payload.resources;
        state.langCode = action.payload.langCode;
      })
      .addCase(fetchTranslationState.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const translationReducer = translationSlice.reducer;

export const selectResources = (state: {
  translationState: ITranslationState;
}) => state.translationState.resources;

export const selectTranslation = createSelector(
  [selectResources],
  (resources) =>
    (key: ILanguageKeys, variables?: string[] | { [key: string]: string }): string => {
      let item = resources[key] || key;
      if(variables){
        if(Array.isArray(variables)){
          for (let index = 0; index < variables.length; index++) {
            item = item.replace(`{{${index}}}`, variables[index]);
          } 
        }else {
          Object.keys(variables).forEach(variableKey => {
            item = item.replace("{{${variableKey}}}", variables[variableKey]);
          });
        }
      }
      return item;
    }
);
