'use client'

import { motion } from 'framer-motion'
import { ContentType, CONTENT_TYPES } from '@/types'

interface ContentTypeSelectorProps {
  selected: ContentType
  onSelect: (type: ContentType) => void
}

export function ContentTypeSelector({ selected, onSelect }: ContentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CONTENT_TYPES.map((type) => (
        <motion.button
          key={type.value}
          onClick={() => onSelect(type.value)}
          className={`relative p-4 rounded-xl text-center transition-all ${
            selected === type.value
              ? type.color === 'turquoise'
                ? 'bg-clickboom-turquoise/20 border-2 border-clickboom-turquoise shadow-turquoise'
                : 'bg-clickboom-pink/20 border-2 border-clickboom-pink shadow-pink'
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl block mb-2">{type.icon}</span>
          <span className="font-semibold block text-clickboom-text">
            {type.label}
          </span>
          <span className="text-xs text-clickboom-text-light mt-1 block">
            {type.description}
          </span>
          {selected === type.value && (
            <motion.div
              layoutId="content-type-indicator"
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                type.color === 'turquoise' ? 'bg-clickboom-turquoise' : 'bg-clickboom-pink'
              }`}
              initial={false}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}
