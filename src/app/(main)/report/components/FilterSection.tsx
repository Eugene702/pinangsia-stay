"use client"

import SearchInput from "@/components/searchInput"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const FilterSection = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
    const [status, setStatus] = useState(searchParams.get('status') || '')

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        
        // Reset to first page when filter changes
        params.delete('page')
        
        router.push(`?${params.toString()}`)
    }

    const handleDateFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (startDate) params.set('startDate', startDate)
        else params.delete('startDate')
        
        if (endDate) params.set('endDate', endDate)
        else params.delete('endDate')
        
        params.delete('page')
        router.push(`?${params.toString()}`)
    }

    const resetFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('')
        router.push('/report')
    }

    return (
        <div className="card bg-white shadow mb-6">
            <div className="card-body">
                <h3 className="card-title text-lg mb-4">Filter Laporan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <div className="form-control">
                        <SearchInput 
                            label="Cari Pemesanan"
                            placeholder="No. pemesanan atau nama tamu"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Status</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                handleFilterChange('status', e.target.value)
                            }}
                        >
                            <option value="">Semua Status</option>
                            <option value="paid">Sudah Bayar</option>
                            <option value="unpaid">Belum Bayar</option>
                            <option value="checked-in">Sudah Check In</option>
                            <option value="checked-out">Sudah Check Out</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Tanggal Mulai</span>
                        </label>
                        <input 
                            type="date" 
                            className="input input-bordered"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* End Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Tanggal Akhir</span>
                        </label>
                        <input 
                            type="date" 
                            className="input input-bordered"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                        className="btn btn-primary"
                        onClick={handleDateFilter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Terapkan Filter
                    </button>
                    
                    <button 
                        className="btn btn-ghost"
                        onClick={resetFilters}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset Filter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FilterSection
