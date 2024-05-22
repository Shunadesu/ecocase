import { db } from '@/db'
import { notFound } from 'next/navigation'
import React from 'react'
import DesignConfigurator from './DesignConfigurator'

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = async ({ searchParams }: PageProps) => {
    // make db call
    const { id } = searchParams

    if (!id || typeof id !== 'string') {
        return notFound()
    }

    const configuration = await db.configuration.findUnique({
        where: { id },
    })

    if (!configuration) {
        return notFound()
    }

    const { imageURL, width, height } = configuration

    return (
        <DesignConfigurator
            configId={configuration.id}
            imageDemimenstions={{ width, height }}
            imageURL={imageURL}
        />
    )
}

export default Page