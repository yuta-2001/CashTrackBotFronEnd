'use client';
import { useEffect, useState } from 'react'
import { useLiff } from '../../_context/LiffProvider'
import { TUser } from '../../_libs/types'

const HeaderComponent = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const liff = useLiff();

  useEffect(() => {
    if (!liff) return;
    const fetchUserProfile = async () => {
      const profile = await liff.getProfile();
      const userData = {
        name: profile.displayName,
        pictureUrl: profile.pictureUrl,
      };
      setUser(userData);
    }

    fetchUserProfile();
  }, [liff]);

  return (
    <header className="shadow p-4 py-3 flex items-center bg-green-500 w-full">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        {
          user?.pictureUrl && (
            <img
              src={user.pictureUrl}
              alt="user icon"
            />
          )
        }
      </div>
      <h1 className="ml-4 text-lg text-white font-medium">{ user?.name }</h1>
    </header>
  )
}

export default HeaderComponent
