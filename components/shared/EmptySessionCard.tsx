import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Users, Clock } from 'lucide-react'

const EmptySessionCard = () => {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      {/* Main Empty State Card */}
      <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
        {/* Gradient Header */}
        <div className='bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden'>

          <div className='relative z-10'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm'>
              <Calendar className='w-8 h-8' />
            </div>
            <h2 className='text-3xl font-bold mb-2'>No Sessions Yet</h2>
            <p className='text-blue-100 text-lg'>Start creating your first attendance session</p>
          </div>
        </div>

        {/* Content Area */}
        <div className='p-12 text-center'>
          {/* Illustration */}
          <div className='mb-8 relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 scale-75'></div>
            <div className='relative'>
              <Image 
                src="/illustration.png"
                alt='No sessions illustration'
                width={300}
                height={300}
                className='mx-auto drop-shadow-2xl'
              />
            </div>
          </div>

          {/* Message */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>Ready to Get Started?</h3>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'>
              Create your first attendance session to start tracking and managing your team&aposs attendance efficiently. 
              Set up meetings, track locations, and monitor participation all in one place.
            </p>
          </div>

          {/* Action Button */}
          <Link href="/admin/create-session">
            <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto'>
              <Plus className='w-6 h-6' />
              Create Your First Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
          <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
            <Users className='w-6 h-6 text-blue-600' />
          </div>
          <h4 className='font-bold text-gray-900 mb-2'>Team Management</h4>
          <p className='text-gray-600 text-sm'>Easily manage and track your team members attendance in real-time.</p>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
          <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4'>
            <Clock className='w-6 h-6 text-green-600' />
          </div>
          <h4 className='font-bold text-gray-900 mb-2'>Time Tracking</h4>
          <p className='text-gray-600 text-sm'>Set precise start and end times for accurate attendance monitoring.</p>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
          <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
            <Calendar className='w-6 h-6 text-purple-600' />
          </div>
          <h4 className='font-bold text-gray-900 mb-2'>Session Planning</h4>
          <p className='text-gray-600 text-sm'>Plan and organize multiple sessions with detailed descriptions.</p>
        </div>
      </div>
    </div>
  )
}

export default EmptySessionCard