import { useEffect, useMemo, useRef, useState } from 'react'
import '../index'
import { LIST_MOCK } from '../mocks'
import { ReactComponent as SearchIcon } from '../icons/search.svg'
import { ReactComponent as FavoriteOff } from '../icons/favoriteOff.svg'
import { ReactComponent as FavoriteOn } from '../icons/favoriteOn.svg'

export default function Search() {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isNavigation, setIsNavigation] = useState<string>('allCoins' || 'favorites')
    const [favorites, setFavorites] = useState<string[]>(['1000000MOG'])
    const [data, setData] = useState<string[]>(LIST_MOCK)
    const [inputValue, setInputValue] = useState<string>('');
    const modalRef = useRef<HTMLDivElement>(null);

    // sorting in searchline

    const filteredItems = useMemo(() => 
      data.filter((el) => el.toLowerCase().includes(inputValue.toLowerCase()))
    , [data, inputValue])

    data.sort();

    // add/delete from favorite

    const toggleCoin = (coin: string) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(coin)) {
                return prevFavorites.filter(favCoin => favCoin !== coin);
            } else {
                return [...prevFavorites, coin];
            }
        });
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpenModal(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update dataNavigate when favorites change
    useEffect(() => {
        setData(isNavigation === 'favorites' ? favorites : LIST_MOCK);
    }, [favorites, isNavigation]);

    return (
        <div className='head'>
            <button
                className={isOpenModal ? 'search font-text open-modal' : 'search font-text'}
                onClick={() => setIsOpenModal(true)}
            ><SearchIcon />SEARCH
            </button>
            {
                isOpenModal && (
                    <div className='container' ref={modalRef}>
                        <div className='filter-tab'>
                            <SearchIcon className='font-text' />
                            <input
                                className='font-text'
                                type='text'
                                value={inputValue}
                                placeholder='Search...'
                                onChange={(e) => setInputValue(e.target.value)}
                            >
                            </input>
                            {
                                inputValue && (
                                    <button className="clear-button" onClick={() => setInputValue('')}>
                                        &times;
                                    </button>
                                )
                            }
                        </div>
                        <div className='navigation-bar'>
                            <button
                                onClick={() => (setIsNavigation('favorites'))}
                                className={isNavigation === 'favorites' ? 'navigate font-text  taret' : 'navigate font-text '}
                            >
                                <FavoriteOn />
                                FAVORITES
                            </button>
                            <button
                                onClick={() => (setIsNavigation('allCoins'))}
                                className={isNavigation === 'allCoins' ? 'navigate font-text  taret' : 'navigate font-text '}
                            >
                                ALL COINS
                            </button>
                        </div>
                        <div className='list-coins'>
                            {
                                filteredItems.map(list => (
                                    <div key={list} className='coin'>
                                        <button className='font-text icon-favorite' onClick={() => toggleCoin(list)}>
                                            {favorites.includes(list) ? <FavoriteOn /> : <FavoriteOff />}
                                        </button>
                                        <span className="font-text">
                                            {list}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
