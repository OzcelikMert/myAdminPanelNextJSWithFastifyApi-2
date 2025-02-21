import { IUserPopulateService } from './user.service';
import {
  IComponentElementContentModel,
  IComponentElementModel,
  IComponentModel,
} from 'types/models/component.model';
import { ComponentTypeId } from '@constants/componentTypes';

export interface IComponentAlternateService {
  langId: string;
}

export type IComponentGetResultServiceElement = {
  contents?: IComponentElementContentModel;
  alternates?: IComponentAlternateService[];
} & Omit<IComponentElementModel, 'contents'>;

export type IComponentGetResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  elements: IComponentGetResultServiceElement[];
} & Omit<IComponentModel, 'elements'>;

export interface IComponentGetWithIdParamService {
  _id: string;
  langId?: string;
}

export interface IComponentGetWithKeyParamService {
  key: string;
  langId?: string;
}

export interface IComponentGetManyParamService {
  _id?: string[];
  key?: string[];
  langId?: string;
  typeId?: ComponentTypeId;
  withContent?: boolean;
}

export type IComponentAddParamService = {} & Omit<
  IComponentModel,
  '_id' | 'authorId' | 'lastAuthorId'
>;

export type IComponentUpdateWithIdParamService = {
  _id: string;
} & IComponentAddParamService;

export interface IComponentDeleteManyParamService {
  _id: string[];
}
