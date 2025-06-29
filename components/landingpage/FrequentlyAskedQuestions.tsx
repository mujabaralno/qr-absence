import React from 'react'
import Accordions from '../shared/Accordions'
import { faqList } from '@/constants'

const FrequentlyAskedQuestions = () => {
  return (
    <section className="w-full wrapper mt-10 ">
        <h2 className="h2-semibold w-full max-w-[20rem] mb-8">
        Frequently Asked Questions
        </h2>
        
        <Accordions items={faqList} />
    </section>
  )
}

export default FrequentlyAskedQuestions