import { useDispatch, useSelector, useStore } from 'react-redux'
import type { IRootState, IAppDispatch, IAppStore } from '@lib/store'

export const useAppDispatch = useDispatch.withTypes<IAppDispatch>()
export const useAppSelector = useSelector.withTypes<IRootState>()
export const useAppStore = useStore.withTypes<IAppStore>()