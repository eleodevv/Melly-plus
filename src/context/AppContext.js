import { createContext, useContext, useState, useEffect } from 'react';
import { getActiveProfile, setActiveProfile, getProfiles, getRecords } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allProfiles = await getProfiles();
      setProfiles(allProfiles);

      const active = await getActiveProfile();
      if (active) {
        setProfile(active);
        const recs = await getRecords(active.id);
        setRecords(recs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = async (profileId) => {
    if (!profileId) {
      await setActiveProfile('');
      setProfile(null);
      setRecords([]);
      return;
    }
    await setActiveProfile(profileId);
    const allProfiles = await getProfiles();
    const active = allProfiles.find(p => p.id === profileId);
    setProfile(active);
    setProfiles(allProfiles);
    const recs = await getRecords(profileId);
    setRecords(recs);
  };

  const refreshRecords = async () => {
    if (profile) {
      const recs = await getRecords(profile.id);
      setRecords(recs);
    }
  };

  const refreshProfiles = async () => {
    const allProfiles = await getProfiles();
    setProfiles(allProfiles);
    if (profile) {
      const updated = allProfiles.find(p => p.id === profile.id);
      if (updated) setProfile(updated);
    }
  };

  return (
    <AppContext.Provider value={{
      profile,
      profiles,
      records,
      loading,
      switchProfile,
      refreshRecords,
      refreshProfiles,
      loadData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
