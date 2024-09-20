import { motion } from 'framer-motion'
import Image from 'next/image'

export function Table({ Tabletype, setSelectedTable }) {
    return (
        <div className='w-full grid grid-cols-5 p-5 gap-4'>
            {Tabletype.map((table) => {
                const { id, table_NO, status } = table
                const imageSrc = status === 'available' ? '/uploads/0.png' : '/uploads/1.png'

                return (
                    <motion.div
                        key={id}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className='relative h-24 w-full cursor-pointer'
                        onClick={() => setSelectedTable(table)}
                    >
                        <Image
                            src={imageSrc}
                            alt={'table'}
                            layout='fill'
                            objectFit='contain'
                            className='rounded'
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='text-xl font-bold'>{table_NO}</span>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
