import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import icons from '@/Ulities/icons'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const NavBar = async () => {

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const isAdmin = user?.email === process.env.ADMIN_EMAIL

    const { GoArrowRight } = icons

    return (
        <nav className='fixed z-[100] h-14 inset-x-0 border-gray-200 bg-white/76 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link href='/' className="flex z-40 font-semibold">
                        case <span className='text-green-600'>Eco</span>
                    </Link>

                    <div className='h-full flex items-center space-x-4'>
                        {user
                            ?
                            (
                                <>
                                    <Link
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}
                                        href='/api/auth/logout'
                                    >
                                        Sign Out
                                    </Link>

                                    {isAdmin ?
                                        <Link
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}
                                            href='/api/auth/logout'
                                        >
                                            Sunny ✨
                                        </Link>
                                        :
                                        null
                                    }
                                    <Link
                                        className={buttonVariants({
                                            size: 'sm',
                                            className: 'hidden sm:flex items-center gap-1',
                                        })}
                                        href='/configure/upload'
                                    >
                                        Create Case
                                        <GoArrowRight className='ml-1.5' size={16} />
                                    </Link>
                                </>

                            )
                            :
                            (
                                <>
                                    <Link
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}
                                        href='/api/auth/register'
                                    >
                                        Sign Up
                                    </Link>


                                    <Link
                                        className={buttonVariants({
                                            size: 'sm',
                                            className: 'hidden sm:flex items-center gap-1',
                                        })}
                                        href='/api/auth/login'
                                    >
                                        Login
                                    </Link>

                                    <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
                                    <Link
                                        className={buttonVariants({
                                            size: 'sm',
                                            className: 'hidden sm:flex items-center gap-1',
                                        })}
                                        href='/configure/upload'
                                    >
                                        Create Case
                                        <GoArrowRight className='ml-1.5' size={16} />
                                    </Link>

                                </>
                            )
                        }
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default NavBar