import { FluentBundle } from '@fluent/bundle';
import { FluentIJs } from 'fluent_conv';

// Taken from i18n, but strongly type ResourceKey
export interface Resource<T> {
  [language: string]: ResourceLanguage<T>;
}

export interface ResourceLanguage<T> {
  [namespace: string]: ResourceKey<T>;
}

export type ResourceKey<T> = T;

export function setBundle(object: Resource<FluentBundle>, lng: string, ns: string, newValue: FluentBundle) {
  if (object[lng] == undefined) {
    object[lng] = {};
  }

  object[lng][ns] = newValue;
}

export function getBundle(
  object: Resource<FluentBundle>,
  lng: string,
  ns: string
): ResourceKey<FluentBundle> | undefined {
  if (object !== undefined && object[lng] !== undefined && object[lng][ns] !== undefined) {
    return object[lng][ns];
  }
  return undefined;
}

export function getI18ResourceForLangAndNamespace(
  object: Resource<FluentIJs>,
  lng: string,
  ns: string
): FluentIJs | undefined {
  // object should exactly have two levels (one for language and one for namespace)
  if (object !== undefined && object[lng] !== undefined && object[lng][ns] !== undefined) {
    return object[lng][ns];
  }
  return undefined;
}
