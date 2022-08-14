import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  // need this or the router query data is not available client-side
  // see https://nextjs.org/docs/api-reference/next/router#router-object
  return {
    props: {},
  };
}

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;

  const { data: session, status } = useSession();

  const loading = status === 'loading';

  useEffect(() => {
    const call = async () => {
      await fetch('/api/stripe/success', {
        method: 'POST',
        body: JSON.stringify({
          session_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      window.location = '/dashboard';
    };

    call();
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    router.push('/');
    return;
  }

  return <div></div>;
};

export default Success;
