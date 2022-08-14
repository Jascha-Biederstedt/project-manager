import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Subscribe = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === 'loading';

  if (loading) {
    return null;
  }

  if (!session) {
    router.push('/');
    return;
  }

  if (session.user.isSubscriber) {
    router.push('/dashboard');
    return;
  }

  return (
    <div>
      <Head>
        <title>Project Manager</title>
        <meta name='description' content='Private Area' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='text-center '>
        <h1 className=' mt-20 font-extrabold text-2xl'>Project Manager</h1>

        <p className='mt-10'>
          Join for just $19.99/m. Free trial for the first 7 days
        </p>

        <button
          className='mt-10 bg-black text-white px-5 py-2'
          onClick={async () => {
            const res = await fetch('/api/stripe/session', {
              method: 'POST',
            });

            const data = await res.json();
          }}
        >
          Create a subscription
        </button>
      </div>
    </div>
  );
};

export default Subscribe;
