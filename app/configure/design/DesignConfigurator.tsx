"use client"

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn, formatPrice } from '@/lib/utils'
import NextImage from 'next/image'
import { Rnd } from 'react-rnd'

import React, { useRef, useState } from 'react'
import HandleComponents from '@/components/HandleComponents'
import { ScrollArea } from '@radix-ui/react-scroll-area'

import { RadioGroup } from '@headlessui/react'
import { COLORS, FINISH, MATERIALS, MODELS } from '@/validator/option-validator'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { BASE_PRICE } from '@/config/products'
import icons from '@/Ulities/icons'
import { Container } from 'postcss'
import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from '@/components/ui/use-toast'

//bg-blue-950 border-blue-950
//bg-zinc-900 border-zinc-900
//bg-rose-950 border-rose-950

interface DesignConfigurator {
    configId: string,
    imageURL: string,
    imageDemimenstions: { width: number, height: number }
}


const DesignConfigurator = ({ configId, imageURL, imageDemimenstions }: DesignConfigurator) => {
    const { toast } = useToast();
    const { GoArrowRight } = icons

    const [options, setOptions] = useState<{
        color: (typeof COLORS)[number]
        model: (typeof MODELS.options)[number]
        material: (typeof MATERIALS.options)[number]
        finish: (typeof FINISH.options)[number]
    }>({
        color: COLORS[0],
        model: MODELS.options[0],
        material: MATERIALS.options[0],
        finish: FINISH.options[0],
    })

    const [renderDimensions, setRenderDimensions] = useState({
        width: imageDemimenstions.width / 4,
        height: imageDemimenstions.height / 4,
    })
    const [renderPosition, setRenderPosition] = useState({
        x: 150,
        y: 205,
    })

    const phoneCaseRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const { startUpload } = useUploadThing('imageUploader')

    async function saveConfiguration() {
        // if(!phoneCaseRef.current) return
        try {
            const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();
            const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();

            const leftOffset = caseLeft - containerLeft
            const topOffset = caseTop - containerTop

            const actualX = renderPosition.x - leftOffset
            const actualY = renderPosition.y - topOffset

            const canvas = document.createElement("canvas")
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')
            const userImage = new Image();
            userImage.crossOrigin = 'anonymous';

            userImage.src = imageURL
            await new Promise((resolve) => (userImage.onload = resolve))

            ctx?.drawImage(
                userImage,
                actualX,
                actualY,
                renderDimensions.width,
                renderDimensions.height
            )

            const base64 = canvas.toDataURL();
            const base64Data = base64.split(',')[1]

            const blob = base64ToBlob(base64Data, "image/png")
            const file = new File([blob], "filename.png", { type: 'image/png' });
            await startUpload([file], { configId })
        } catch (err) {
            toast({
                title: "something went wrong",
                description: "There was a problem saving your config, please try again",
                variant: "destructive",
            })
        }
    }

    function base64ToBlob(base64: string, mimeType: string) {
        const byteCharacters = atob(base64)
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: mimeType })
    }

    return (
        <div className='relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20'>
            <div
                ref={containerRef}
                className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
                <div className='relative w-60 bg-opacity-50 rounded-lg  pointer-events-none'>
                    <AspectRatio ratio={896 / 1831}
                        className='pointer-events-none relative z-50 aspect-[896/1831] w-full rounded-lg '>
                        <NextImage
                            fill
                            alt='phone image'
                            src="/phone-template.png"
                            className='pointer-events-none z-50 select-none'
                        />
                    </AspectRatio>
                    <div className='absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[3px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]' />

                    <div className={cn("absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]", `bg-${options.color.tw}`)} />
                </div>

                <Rnd default={
                    {
                        x: 150,
                        y: 205,
                        height: imageDemimenstions.height / 4,
                        width: imageDemimenstions.width / 4,
                    }
                }
                    onResizeStop={(_, __, ref, ___, { x, y }) => {
                        setRenderDimensions({
                            height: parseInt(ref.style.height.slice(0, -2)),
                            width: parseInt(ref.style.width.slice(0, -2)),
                        })

                        setRenderPosition({ x, y })
                    }}

                    onDragStop={(_, data) => {
                        const { x, y } = data
                        setRenderPosition({ x, y })
                    }}

                    className='absolute z-20 border-[3px] border-primary'
                    lockAspectRatio
                    resizeHandleComponent={{
                        bottomRight: <HandleComponents />,
                        bottomLeft: <HandleComponents />,
                        topRight: <HandleComponents />,
                        topLeft: <HandleComponents />,

                    }}
                >
                    <div className='relative w-full h-full'>
                        <NextImage
                            src={imageURL}
                            fill
                            alt='your image'
                            className='pointer-events-none'
                        />
                    </div>
                </Rnd>
            </div>

            <div className='h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white'>
                <ScrollArea
                    aria-hidden='true'
                    className='relative flex-1 bottom-0 h-12 bg-gradient-to-t from-white overflow-auto'
                >
                    <div className='px-8 pb-12 pt-8'>
                        <h2 className='tracking-tight font-bold text-3xl'>
                            Customize your phone case
                        </h2>

                        <div className='w-full h-px bg-zinc-200 my-6' />

                        <div className='relative mt-4 h-full flex flex-col justify-between'>

                            <div className='flex flex-col gap-6'>

                                <RadioGroup value={options.color}
                                    onChange={(value) => {
                                        setOptions((prev) => ({
                                            ...prev,
                                            color: value,
                                        }))
                                    }}
                                >
                                    <Label>
                                        Color: {options.color.label}
                                    </Label>

                                    <div className='mt-3 flex items-center space-x-3'>
                                        {COLORS.map((color) => (
                                            <RadioGroup.Option
                                                key={color.label}
                                                value={color}
                                                className={({ active, checked }) => cn('relative z-10 -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none foucus:ouline-none border-2 border-transparent',
                                                    {
                                                        [`border-${color.tw}`]: active || checked,
                                                    }
                                                )}
                                            >
                                                <span className={cn(`bg-${color.tw}`, "h-8 w-8 rounded-full border border-black border-opacity-10")} />
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>

                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Model</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline"
                                                className='w-full justify-between z-10'
                                                role='combobox'>
                                                {options.model.label}
                                                <ChevronDownIcon className='h-4 w-4 ml-4 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className='z-10 bg-white border border-green-500'>
                                            {
                                                MODELS.options.map((model) => (
                                                    <DropdownMenuItem
                                                        className={cn("flex lg:w-[200px] xl:w-[300px] text-sm gap-1 items-center p-1.5 cursor-default  z-[100] hover:bg-zinc-100", {
                                                            "bg-zinc-100": model.label === options.model.label,
                                                        })}
                                                        key={model.label}
                                                        onClick={() => {
                                                            setOptions((prev) => ({ ...prev, model }))
                                                        }
                                                        }
                                                    >

                                                        <CheckIcon className={cn('mr-2 h-4 w-4', model.label === options.model.label ? 'opacity-100' : 'opacity-0')} />
                                                        {model.label}
                                                    </DropdownMenuItem>
                                                ))
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {[MATERIALS, FINISH].map(({ name, options: selectableOptions }) => (
                                    <RadioGroup key={name} value={name}
                                        onChange={(val) => {
                                            setOptions((prev) => ({
                                                ...prev,
                                                [name]: val,
                                            }))
                                        }}
                                    >
                                        <Label>
                                            {name.slice(0, 1).toUpperCase() + name.slice(1)}
                                        </Label>

                                        <div className='mt-3 space-y-4'>
                                            {selectableOptions.map((option) => (
                                                <RadioGroup.Option
                                                    key={option.value}
                                                    value={option}

                                                    className={({ active, checked }) => cn('relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-0 sm:flex sm:justify-between',
                                                        {
                                                            'border-primary': active || checked,
                                                        }
                                                    )
                                                    }>

                                                    <span className='flex items-center'>
                                                        <span className='flex flex-col text-sm'>
                                                            <RadioGroup.Label as='span' className='font-medium text-gray-900'>
                                                                {option.label}
                                                            </RadioGroup.Label>

                                                            {option.description ?
                                                                <RadioGroup.Description as='span'
                                                                    className='text-gray=500'
                                                                >
                                                                    <span className='block sm:inline'>{option.description}</span>
                                                                </RadioGroup.Description>
                                                                : null}


                                                        </span>
                                                    </span>
                                                    <RadioGroup.Description as="span" className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'>
                                                        <span className='font-medium text-gray-900'>
                                                            {
                                                                formatPrice(option.price / 100)
                                                            }
                                                        </span>
                                                    </RadioGroup.Description>
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                ))}

                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className='w-full px-8 h-16 bg-white'>
                    <div className='h-px w-full bg-zinc-200' />
                    <div className='w-full flex h-full justify-end items-center'>
                        <div className='w-full flex gap-6 items-center'>
                            <p className='font-medium whitespace-nowrap'>
                                {formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}
                            </p>

                            <Button
                                onClick={() =>
                                    saveConfiguration()

                                }
                                size='sm' className='w-full'>
                                Countinue
                                <GoArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default DesignConfigurator