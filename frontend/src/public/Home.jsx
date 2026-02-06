import React, { useState, useEffect } from 'react';
import axios from "axios";
import heroImage from '../assets/img/image-2.svg';
import laptopImage from '../assets/img/landing2.png';
import PublicJobCard from '../components/users/PublicJobCard';
import {
  Clock,
  Link2,
  BoxSearch,
} from "iconsax-reactjs";
import NavbarLandingPage from '../components/NavbarLandingPage';
import FooterLandingPage from '../components/FooterLandingPage';


const Home = () => {
  const [showJobs, setShowJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/public/jobs/");
      setJobs(res.data.data || []);
      setFilteredJobs([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

const applyFilter = (keyword = searchQuery, loc = location) => {
  let result = [...jobs];

  if (keyword.trim()) {
    result = result.filter((job) =>
      job.job_name?.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (loc.trim()) {
    result = result.filter((job) =>
      job.location?.toLowerCase().includes(loc.toLowerCase())
    );
  }

  setFilteredJobs(result);
};

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (searchTimeout) clearTimeout(searchTimeout);

  const timeout = setTimeout(() => {
    applyFilter(value, location);
  }, 500);

  setSearchTimeout(timeout);
};

const handleLocationChange = (e) => {
  const value = e.target.value;
  setLocation(value);

  if (searchTimeout) clearTimeout(searchTimeout);

  const timeout = setTimeout(() => {
    applyFilter(searchQuery, value);
  }, 500);

  setSearchTimeout(timeout);
};


const handleSearch = () => {
  applyFilter();
  setShowJobs(true);
};


  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const salaryRanges = [
    { value: 'all', label: 'Semua' },
    { value: '0-3', label: '< Rp 3jt' },
    { value: '3-5', label: 'Rp 3jt - Rp 5jt' },
    { value: '5-7', label: 'Rp 5jt - Rp 7jt' },
    { value: '7-10', label: 'Rp 7jt - Rp 10jt' },
    { value: '10+', label: '> Rp 10jt' },
  ];

  const jobTypes = [
    { value: 'fulltime', label: 'Full-time' },
    { value: 'parttime', label: 'Part-time' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  const getSelectedSalaryLabel = () => {
    const selected = salaryRanges.find(s => s.value === selectedSalary);
    return selected ? selected.label : 'Pilih Kisaran Gaji';
  };

  return (
    <>
    <NavbarLandingPage />
    <div className="min-h-screen bg-white p-4">
      {/* Hero Section */}
      <section
        className="relative text-white overflow-hidden rounded-t-4xl"
        style={{
          background: "linear-gradient(to bottom, #004F8F 0%, #009B49 100%)",
        }}
      >
        {/* KONTEN */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            {/* TEXT */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Temukan Karir Impian di
                Jaringan Muhammadiyah
              </h1>

              <p className="text-lg mb-8 opacity-90">
                Bergabung dengan Amal Usaha Muhammadiyah bukan sekadar mencari pekerjaan,
                melainkan menjadi bagian dari misi mulia menyebarkan kebaikan.
              </p>

              <button className="border-2 border-white text-white bg-transparent px-6 py-3 rounded-lg font-semibold transition hover:bg-white hover:text-[#004F8F]">
                Daftar Sekarang!
              </button>
            </div>

            {/* GAMBAR (DI BELAKANG WAVE) */}
            <div className="flex justify-center relative z-10 -mb-40">
              <img
                src={heroImage}
                alt="Team collaboration"
                className="w-full max-w-6xl rounded-4xl"
              />
            </div>

          </div>
        </div>

        {/* WAVE PUTIH (DI ATAS GAMBAR) */}
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 block w-full z-30 pointer-events-none"
        >
          <path
            d="M0,64 C240,120 480,120 720,80 960,40 1200,40 1440,64 L1440,120 L0,120 Z"
            fill="#ffffff"
          />
        </svg>
      </section>

      {/* Main Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Fitur Utama KarirMu
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">Manajemen Lowongan</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">Manajemen Lamaran</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">Upload CV & Portofolio</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">Validasi & Tahapan Seleksi</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">Notifikasi Status</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <img 
                src={laptopImage} 
                alt="KarirMu Dashboard" 
                className="w-full max-w-lg"
              />
            </div>
          </div>

          {/* Search Section */}
          <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-96">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                <input
                  type="text"
                  placeholder="Cari posisi/judul anda..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            <div className="relative w-full md:w-64">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
                <input
                  type="text"
                  placeholder="Pilih Lokasi"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

            </div>
            <button 
              onClick={handleSearch}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition duration-300 font-semibold w-full md:w-auto"
            >
              Temukan Kerja
            </button>
          </div>

          {/* Job Cards Section with Filter - Muncul setelah search */}
          {showJobs && (
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-6">
                {/* Filter Sidebar */}
                <div className="w-full">
                  <div className="bg-white rounded-lg shadow-sm p-6 md:sticky md:top-6">
                    {/* Kisaran Gaji - Dropdown */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Kisaran Gaji</h3>
                      <div className="relative">
                        <button
                          onClick={() => setIsSalaryDropdownOpen(!isSalaryDropdownOpen)}
                          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between"
                        >
                          <span className={selectedSalary ? 'text-gray-900' : 'text-gray-500'}>
                            {getSelectedSalaryLabel()}
                          </span>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${isSalaryDropdownOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isSalaryDropdownOpen && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {salaryRanges.map((salary) => (
                              <div
                                key={salary.value}
                                onClick={() => {
                                  setSelectedSalary(salary.value);
                                  setIsSalaryDropdownOpen(false);
                                }}
                                className={`px-4 py-2 cursor-pointer hover:bg-teal-50 transition ${
                                  selectedSalary === salary.value ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                {salary.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tipe Pekerjaan */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Tipe Pekerjaan</h3>
                      <div className="space-y-3">
                        {jobTypes.map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="jobType"
                              value={type.value}
                              checked={selectedJobType === type.value}
                              onChange={(e) => setSelectedJobType(e.target.value)}
                              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-teal-600 transition">
                              {type.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setSelectedSalary('');
                        setSelectedJobType('');
                      }}
                      className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>

                {/* Job Cards */}
                <div className="w-full">
                 {loading && (
                        <p className="text-sm text-gray-500">Memuat lowongan...</p>
                      )}

                      {!loading && filteredJobs.length === 0 && (
                        <p className="text-sm text-gray-500">Lowongan tidak ditemukan</p>
                      )}

                      {!loading &&
                        filteredJobs.map((job) => (
                          <PublicJobCard
                            key={job._id}
                            job={job}
                          />
                        ))
                      }
                  {/* Pagination */}
                  <div className="bg-white rounded-lg shadow-sm px-6 py-4 flex justify-between items-center text-sm text-gray-600 mt-6">
                    {/* INFO */}
                    <span>
                      Menampilkan <b>1–5</b> dari <b>12</b> Lowongan
                    </span>

                    {/* PAGE CONTROL */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:underline'}`}
                      >
                        &lt; Prev
                      </button>

                      {[1, 2, 3].map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`
                            w-7 h-7 flex items-center justify-center rounded
                            ${currentPage === p
                              ? "bg-[#409144] text-white font-semibold"
                              : "hover:bg-gray-100"
                            }
                          `}
                        >
                          {p}
                        </button>
                      ))}

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
                        disabled={currentPage === 3}
                        className={`${currentPage === 3 ? 'text-gray-400 cursor-not-allowed' : 'hover:underline'}`}
                      >
                        Next &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Mengapa memilih KarirMu?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Solusi terbaik untuk lowongan rekrutmen dan pencarian kerja di era digital
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Efisien */}
            <div 
              onClick={() => handleFeatureClick('efisien')}
              className={`p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 text-center cursor-pointer ${
                selectedFeature === 'efisien' 
                  ? 'bg-teal-50 border-2 border-teal-500' 
                  : 'bg-white'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                selectedFeature === 'efisien' 
                  ? 'bg-teal-500' 
                  : 'bg-teal-100'
              }`}>
                <Clock className="w-8 h-8" color="#ffffff" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Efisien</h3>
              <p className="text-gray-600 leading-relaxed">
                Otomatis rekrutmen saat ini membantu perusahaan menghemat waktu hingga 70% untuk merekrut kandidat terbaik.
              </p>
            </div>

            {/* Integrasi */}
            <div 
              onClick={() => handleFeatureClick('integrasi')}
              className={`p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 text-center cursor-pointer ${
                selectedFeature === 'integrasi' 
                  ? 'bg-teal-50 border-2 border-teal-500' 
                  : 'bg-white'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                selectedFeature === 'integrasi' 
                  ? 'bg-teal-500' 
                  : 'bg-teal-100'
              }`}>
                <Link2 color="#ffffff" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Integrasi</h3>
              <p className="text-gray-600 leading-relaxed">
                Terhubung dengan sistem Amal Usaha Muhammadiyah dan daftar kerja dari satu dashboard
              </p>
            </div>

            {/* Transparansi */}
            <div 
              onClick={() => handleFeatureClick('transparansi')}
              className={`p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 text-center cursor-pointer ${
                selectedFeature === 'transparansi' 
                  ? 'bg-teal-50 border-2 border-teal-500' 
                  : 'bg-white'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                selectedFeature === 'transparansi' 
                  ? 'bg-teal-500' 
                  : 'bg-teal-100'
              }`}>
                <BoxSearch className="w-8 h-8" color="#ffffff" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Transparansi</h3>
              <p className="text-gray-600 leading-relaxed">
                Proses rekrutmen yang jelas dan terbuka memudahkan semua pihak untuk mengikuti setiap tahap tanpa hambatan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
{/* CTA WRAPPER */}
<section className="relative mt-20">
  
  {/* CTA CARD */}
  <div
    className="relative z-10 text-white py-16 px-6 rounded-3xl mx-4 md:mx-8"
    style={{
      background: "linear-gradient(to bottom, #004F8F 0%, #009B49 100%)",
    }}
  >
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Siap Memulai?
      </h2>
      <p className="text-lg mb-8 opacity-90">
        Gabungan diri Anda dan temukan lebih banyak solusi untuk proses rekrutment
      </p>
      <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-teal-700 transition font-semibold">
        Daftar Sekarang!
      </button>
    </div>
  </div>

  {/* WHITE SPACER CARD (JARAK KE FOOTER) */}
  <div className="bg-white h-24 rounded-t-3xl -mt-8"></div>

</section>
    </div>
    <FooterLandingPage />
    </>
  );
};

export default Home;