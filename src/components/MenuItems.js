import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import database, { storage } from '../utilities/firebase'
import UserAvatar from './UserAvatar'
import { startLogout } from '../actions/auth'
import { startSetImageURL } from '../actions/avatar'

const MenuItems = ({ isAuthenticated, startLogout, startSetImageURL, showOnDesktop, user, avatar, redirect }) => {
    const [isMounted, setIsMounted] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const itemClass = showOnDesktop ? 'item desktop' : 'item'

    useEffect(() => {
        setIsMounted(true)
        if (isMounted && user) {
            !avatar
                ? (
                    storage
                        .ref(user)
                        .child('display_pic')
                        .getDownloadURL()
                        .then((url) => {
                            startSetImageURL(user, url)
                            setIsLoaded(true)

                        })
                        .catch((error) => {
                            setIsLoaded(true)
                        })
                )
                : setIsLoaded(true)
        }
        return () => {
            setIsMounted(false)
        }
    }, [user])

    const logoutAndRedirect = () => {
        startLogout().then(redirect('/'))
    }

    return (
        <>
            {isAuthenticated
                ? (
                    <>
                        <button className={itemClass} onClick={redirect('/')}>Home</button>
                        <button className={itemClass} onClick={redirect('/create')}>Create Post</button>
                        <button className={itemClass} onClick={logoutAndRedirect}>Logout</button>
                        <button className={`${itemClass} navbar__avatar`} onClick={redirect('/me')}>
                            {!isLoaded
                                ? (
                                    <div className='placeholder__container'>
                                        <div className='placeholder__square'>
                                            <div className='ui placeholder'>
                                                <div className='square image'></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                : <UserAvatar src={avatar} isCurrentUser={true} />
                            }
                        </button>
                    </>
                )
                : (
                    <>
                        <button className={itemClass} onClick={redirect('/signup')}>Sign Up</button>
                        <button className={itemClass} onClick={redirect('/login')}>Login</button>
                    </>
                )
            }
            <a href='https://github.com/sharonrcg' className={itemClass} target='_blank'>
                <i className='code icon' />
            </a>
        </>
    )
}

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startSetImageURL: (user, url) => dispatch(startSetImageURL(user, url))
})

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    user: state.auth.uid,
    avatar: state.avatar[state.auth.uid]
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuItems)
