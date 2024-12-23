import { CurrencyId } from '@constants/currencyTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILanguageGetResultService } from 'types/services/language.service';

export interface ISettingState {
  mainLangId: string;
  languages: ILanguageGetResultService[];
  currencyId: CurrencyId;
}

const initialState: ISettingState = {
  mainLangId: '',
  languages: [],
  currencyId: CurrencyId.Dollar,
};

const settingSlice = createSlice({
  name: 'settingState',
  initialState,
  reducers: {
    setMainLangIdState(
      state,
      action: PayloadAction<ISettingState['mainLangId']>
    ) {
      state.mainLangId = action.payload;
    },
    setLanguagesState(
      state,
      action: PayloadAction<ISettingState['languages']>
    ) {
      state.languages = action.payload;
    },
    setCurrencyIdState(
      state,
      action: PayloadAction<ISettingState['currencyId']>
    ) {
      state.currencyId = action.payload;
    },
  },
});

export const { setMainLangIdState, setLanguagesState, setCurrencyIdState } =
  settingSlice.actions;

export const settingReducer = settingSlice.reducer;
