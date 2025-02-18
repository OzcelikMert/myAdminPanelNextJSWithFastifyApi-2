import { EndPoints } from '@constants/endPoints';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const ComponentError404 = React.memo(() => {
  const router = useRouter();
  const t = useAppSelector(selectTranslation);

  return (
    <section className="error-404">
      <div className="container">
        <h1 className='text-danger my-5'>404</h1>
        <Image
          src="/images/errors/404.gif"
          alt='404'
          className='img-fluid'
          height={500}
          width={250}
        />
        <h3 className='my-3 fs-4'>{t('looksLikeYouAreLost')} &#128546;</h3>
        <p className='my-3 fs-5'>{t('404Error')}</p>
        <Link href={EndPoints.DASHBOARD} className="btn btn-gradient-success btn-lg mt-4 py-3 px-5 fs-6">
          <i className="mdi mdi-arrow-left-circle-outline"></i>{' '}
          {t('returnHomePage')}
        </Link>
      </div>
    </section>
  );
});

export default ComponentError404;
