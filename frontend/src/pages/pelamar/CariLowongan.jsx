import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
/* ICONS */
import {Check, CloseCircle, Location, Profile, Save2, SearchNormal1} from "iconsax-reactjs";

import PelamarLayout from "../../components/layout/PelamarLayout";
import PublicJobCard from "../../components/users/PublicJobCard";

const CariLowongan = () => {
  const [showFilter, setShowFilter] = useState(false);

  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([]);
  const displayJobs = filteredJobs.length ? filteredJobs : jobs;
  const [searchTimeOut, setSearchTimeOut] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

    useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public/jobs/");

        setJobs(res.data.data || []);
        setFilteredJobs(res.data.data)
        console.log(res.data.data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

 const applyFilter = (keyword = search, location = city) => {
    let result = [...jobs];

    if (keyword.trim()) {
      result = result.filter((job) =>
        job.job_name
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    }

    if (location.trim()) {
      result = result.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    setFilteredJobs(result);
  };

  // ===== HANDLERS =====
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if(searchTimeOut) {
        clearTimeout(searchTimeOut);
    }

    const timeout = setTimeout(() => {
        applyFilter(value, city);
    }, 500)

    setSearchTimeOut(timeout);
  };

  const handleCity = (e) => {
    const value = e.target.value;
    setCity(value);

    if (searchTimeOut) {
      clearTimeout(searchTimeOut);
    }

    const timeout = setTimeout(() => {
      applyFilter(search, value);
    }, 500);

    setSearchTimeOut(timeout);
  };


  const handleSubmitSearch = () => {
    applyFilter(search, city);
    setShowFilter(true);
  };

  return (
    <PelamarLayout>
      <div className="space-y-6">
        {/* HEADER SEARCH */}
        <div className="px-4 py-3 rounded-t-2xl font-medium text-white" style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}>
          Opsi Pencarian & Filter Lowongan
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="font-semibold text-gray-700">Opsi Pencarian Lowongan</h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end">
            {/* Cari Pekerjaan */}
            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
                Cari Pekerjaan
            </label>

            <div className="relative">
                <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />

                <input
                type="text"
                placeholder="UI/UX Designer"
                value={search}
                onChange={handleSearch}
                onFocus={() => setShowFilter(true)}
                className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />

                {search && (
                <CloseCircle
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70"
                    onClick={() => {
                    setSearch("");
                    applyFilter("", city);
                    }}
                />
                )}
            </div>
            </div>
            {/* Cari Kota */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Cari Kota / Provinsi</label>
              <div className="relative">
                <Location className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />        
                {/* <input type="text" placeholder="Magelang" onFocus={() => setShowFilter(true)}
                  className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500" /> */}
                <input
                type="text"
                placeholder="Kota"
                value={city}
                onChange={handleCity}
                onFocus={() => setShowFilter(true)}
                className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {city && (
                <CloseCircle
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70"
                    onClick={() => {
                    setCity("");
                    applyFilter(search, "");
                    }}
                />
                )}
              </div>
            </div>

            <div className="flex items-end">
              <button onClick={handleSubmitSearch} className="bg-green-600 hover:bg-green-700 text-white px-6 h-10 rounded-lg text-sm font-medium whitespace-nowrap">Cari</button>
            </div>
          </div>

          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-[46%_50%] gap-6 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Range Gaji (Rp)</label>
                <input type="text" placeholder="Contoh: 2.000.000 - 5.000.000"
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Tipe Pekerjaan</label>
                <div className="flex flex-wrap justify-between h-10 items-center">
                  {["Fulltime", "Parttime", "Contract", "Intern"].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer text-gray-700">
                      <input type="radio" name="jobType" className="accent-green-600" />{item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DAFTAR LOWONGAN */}
          <p className="px-4 py-3 rounded-t-2xl font-medium text-white" style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}>
            Daftar Lowongan Hasil Pencarian</p>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
        <p className="text-sm text-gray-500">
            Memuat lowongan...
        </p>
        )}

        {!loading && displayJobs.length === 0 && (
        <p className="text-sm text-gray-500">
            Lowongan tidak ditemukan
        </p>
        )}

        {!loading &&
        displayJobs.map((job) => (
            <PublicJobCard
            key={job._id}
            job={job}
            onClick={() =>
                navigate(`/jobs/${job._id}`)}
            />
        ))}
        </div>
      </div>
    </PelamarLayout>
  );
};

export default CariLowongan;