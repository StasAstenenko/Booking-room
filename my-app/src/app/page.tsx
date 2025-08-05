import Link from 'next/link';

const Home = () => {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='text-3xl font-bold mb-4'>Meeting Room Booking App</h1>
      <p className='text-lg mb-6'>
        Ласкаво просимо! Увійдіть або зареєструйтеся, щоб почати користування.
      </p>
      <div className='flex gap-4'>
        <Link
          href='/login'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Увійти
        </Link>
        <Link
          href='/register'
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        >
          Зареєструватися
        </Link>
      </div>
    </main>
  );
};

export default Home;
