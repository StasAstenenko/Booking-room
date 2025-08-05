'use client';

import { registerUser } from '@/firebase/auth';
import { RegUser } from '@/types/authTypes';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const initialFormValue: RegUser = {
  name: '',
  email: '',
  password: '',
};

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialFormValue);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (form.name.trim().length < 3) {
      return alert('Ім’я повинно містити щонайменше 3 символи');
    }
    if (!form.email.includes('@')) {
      return alert('Email повинен містити символ "@"');
    }
    if (form.password.length < 8) {
      return alert('Пароль повинен містити щонайменше 8 символів');
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateForm();
    if (validation) {
      try {
        setError(false);
        setLoading(true);
        await registerUser(form);
        router.push('/dashboard');
      } catch (error) {
        setError(true);
        return error;
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClick = () => {
    return router.push('/login');
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4'>
      <h1 className='text-2xl font-bold mb-4'>Реєстрація</h1>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-sm flex flex-col gap-4 mb-5'
      >
        <input
          type='text'
          name='name'
          placeholder='Ім’я'
          value={form.name}
          onChange={handleChange}
          className='border p-2 rounded'
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          className='border p-2 rounded'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Пароль'
          value={form.password}
          onChange={handleChange}
          className='border p-2 rounded'
          required
        />
        {error && <p className='text-red-500 text-sm'>Something wrong...</p>}
        <button
          type='submit'
          disabled={loading}
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        >
          {loading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>
      <button
        type='submit'
        onClick={handleClick}
        disabled={loading}
        className='bg-green-600 w-[384] text-white px-4 py-2 rounded hover:bg-green-700'
      >
        Логін
      </button>
    </main>
  );
};

export default RegisterPage;
