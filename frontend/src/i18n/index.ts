import { commonTranslations, TranslationItem } from './common';
import { homeTranslations } from './home';
import { servicesTranslations } from './services';
import { bookingsTranslations } from './bookings';
import { welfareTranslations } from './welfare';
import { b2bTranslations } from './b2b';
import { workerTranslations } from './worker';
import { customerTranslations } from './customer';
import { adminTranslations } from './admin';
import { authTranslations } from './auth';
import { registrationTranslations } from './registration';

export type { TranslationItem };
export type Language = 'en' | 'hi' | 'kn' | 'ta';

export interface TranslationMap {
  [key: string]: TranslationItem;
}

export const masterTranslations: TranslationMap = {
  ...commonTranslations,
  ...homeTranslations,
  ...servicesTranslations,
  ...bookingsTranslations,
  ...welfareTranslations,
  ...b2bTranslations,
  ...workerTranslations,
  ...customerTranslations,
  ...adminTranslations,
  ...authTranslations,
  ...registrationTranslations
};

export default masterTranslations;
