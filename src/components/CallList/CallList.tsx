/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ru } from "date-fns/locale/ru";
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCallsAsync } from '../../store/callsSlice';
import CellTable from '../CellTable/CellTable';

import IconArrowLeft from '../../assets/icons/arrow-left.svg';
import IconArrowRight from '../../assets/icons/arrow-right.svg';
import IconClose from '../../assets/icons/close.svg';
import IconRefresh from '../../assets/icons/refresh.svg';
import {
    ALL_TYPES,
    CUSTOM_DATE,
    INCOMING,
    MONTH,
    MONTH_NAMES_IN_RUSSIAN,
    NO_RECORDS,
    OUTGOING,
    THREE_DAYS,
    WEEK,
    YEAR,
} from '../../utils/consts';
import './CallList.scss';


const CallList = () => {
    const dispatch = useDispatch();
    const calls = useSelector((state: RootState) => state.calls.calls);
    const status = useSelector((state: RootState) => state.calls.status);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [inOut, setInOut] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [order, setOrder] = useState<string>('');
    const [hoveredCallId, setHoveredCallId] = useState<number | null>(null);
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
    const [, setIsCustomDate] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<string>(THREE_DAYS);
    const dateRanges = [THREE_DAYS, WEEK, MONTH, YEAR];

    registerLocale("ru", ru);

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
        }
    }, [startDate, endDate, inOut, sortBy, order, dateRange]);

    const fetchData = () => {
        if (startDate && endDate) {
            dispatch(fetchCallsAsync({
                date_start: startDate.toISOString().split('T')[0],
                date_end: endDate.toISOString().split('T')[0],
                in_out: inOut,
                sort_by: sortBy,
                order: order
            }));
        }
    };

    const resetFilters = () => {
        setStartDate(new Date());
        setEndDate(new Date());
        setInOut('');
        setSortBy('');
        setOrder('');
        setIsCustomDate(false);
        setDateRange(THREE_DAYS);
        fetchData();
    };

    const handleDateRangeChange = (range: string) => {
        const now = new Date();
        setIsCustomDate(false);
        switch (range) {
            case THREE_DAYS:
                setStartDate(new Date(now.setDate(now.getDate() - 3)));
                break;
            case WEEK:
                setStartDate(new Date(now.setDate(now.getDate() - 7)));
                break;
            case MONTH:
                setStartDate(new Date(now.setMonth(now.getMonth() - 1)));
                break;
            case YEAR:
                setStartDate(new Date(now.setFullYear(now.getFullYear() - 1)));
                break;
            case CUSTOM_DATE:
                setIsCustomDate(true);
                break;
            default:
                break;
        }
        setDateRange(range);
    };

    const handlePrevDateRange = () => {
        const currentIndex = dateRanges.indexOf(dateRange);
        const newIndex = (currentIndex - 1 + dateRanges.length) % dateRanges.length;
        handleDateRangeChange(dateRanges[newIndex]);
    };

    const handleNextDateRange = () => {
        const currentIndex = dateRanges.indexOf(dateRange);
        const newIndex = (currentIndex + 1) % dateRanges.length;
        handleDateRangeChange(dateRanges[newIndex]);
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case "Дозвонился":
                return <div className="tag good">Хорошо</div>;
            case "Не дозвонился":
                // return <div className="tag bad">Плохо</div>;
                return <div className="tag excellent">Отлично</div>;
            default:
                return null;
        }
    };

    const getCallStatusOrError = (call: any) => {
        return call.errors.length > 0 ? <span className="error">{call.errors.join(', ')}</span> : getStatusTag(call.status);
    };

    const formatPhoneNumber = (phoneNumber: string) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phoneNumber;
    };

    const fetchRecording = async (recordId: string, partnershipId: string) => {
        console.log({ recordId, partnershipId })
        // Аудио с вашей АПИ не работает, поэтому прикладываю свой пример
        const apiUrl = "https://samplelib.com/lib/preview/mp3/sample-3s.mp3";
        setRecordingUrl(apiUrl);

        // const apiUrl = "https://api.skilla.ru/mango/getRecord";
        // const response = await fetch(apiUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer testtoken`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         record: recordId,
        //         partnership_id: partnershipId,
        //     }),
        // });
        // const blob = await response.blob();
        // const url = URL.createObjectURL(blob);
        // setRecordingUrl(url);
    };

    const handleMouseEnter = (call: any) => {
        setHoveredCallId(call.id);

        if (call.record && call.record.length > 1) {
            fetchRecording(call.record, call.partnership_id);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCallId(null);
        setRecordingUrl(null);
    };

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    const dayBeforeYesterday = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];

    const todayCalls = calls.filter(call => call.date.split(' ')[0] === today);
    const yesterdayCalls = calls.filter(call => call.date.split(' ')[0] === yesterday);
    const dayBeforeYesterdayCalls = calls.filter(call => call.date.split(' ')[0] === dayBeforeYesterday);

    const getWeekDays = () => {
        const days = [];
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            days.push(day);
        }
        return days.reverse();
    };

    const getWeeksOfMonth = () => {
        const weeks = [];
        const now = new Date();
        for (let i = 0; i < 4; i++) {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - (i * 7));
            weeks.push(startOfWeek);
        }
        return weeks.reverse();
    };

    const getMonthsOfYear = () => {
        const months = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const month = new Date(now);
            month.setMonth(now.getMonth() - i);
            months.push(month);
        }
        return months.reverse();
    };

    const getSelectedDateCalls = () => {
        if (startDate && endDate) {
            return calls.filter(call => {
                const callDate = new Date(call.date.split(' ')[0]);
                return callDate >= startDate && callDate <= endDate;
            });
        }
        return [];
    };

    if (status === 'failed') {
        return <div>Error loading calls</div>;
    }

    return (
        <div className="call-list-container">
            <div className="filters">
                <div className="filter-left">
                    <div className="dropdown">
                        <button className={`dropbtn ${inOut === '1' || inOut === '0' ? 'active' : ''}`}>
                            {inOut === ''
                                ? ALL_TYPES
                                : inOut === '1'
                                    ? INCOMING
                                    : OUTGOING
                            }
                            <div className="caret"></div>
                        </button>
                        <div className="dropdown-content">
                            <a href="#" onClick={() => setInOut('')}>{ALL_TYPES}</a>
                            <a href="#" onClick={() => setInOut('1')}>{INCOMING}</a>
                            <a href="#" onClick={() => setInOut('0')}>{OUTGOING}</a>
                        </div>
                    </div>

                    <button className="reset-btn" onClick={resetFilters}>
                        Сбросить фильтры
                        <img src={IconClose} alt="" />
                    </button>
                </div>

                <div className="filter-right">
                    <button className="arrow-btn" onClick={handlePrevDateRange}>
                        <img src={IconArrowLeft} alt="" />
                    </button>

                    <div className="date-range">
                        <button className="date-range-btn" onClick={() => handleDateRangeChange(dateRange)}>
                            <i className="icon icon-calendar"></i> {dateRange === CUSTOM_DATE && startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : dateRange}
                        </button>
                        <div className="date-range-dropdown">
                            <a href="#" onClick={() => handleDateRangeChange(THREE_DAYS)}>{THREE_DAYS}</a>
                            <a href="#" onClick={() => handleDateRangeChange(WEEK)}>{WEEK}</a>
                            <a href="#" onClick={() => handleDateRangeChange(MONTH)}>{MONTH}</a>
                            <a href="#" onClick={() => handleDateRangeChange(YEAR)}>{YEAR}</a>
                            <a>
                                Указать даты
                                <div className="custom-date-picker">
                                    <DatePicker
                                        locale="ru"
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        dateFormat="dd.MM.yy"
                                        className="date-picker-input"
                                        placeholderText="__.__.__"
                                    />
                                    <span className="date-picker-separator">-</span>
                                    <DatePicker
                                        locale="ru"
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        dateFormat="dd.MM.yy"
                                        className="date-picker-input"
                                        placeholderText="__.__.__"
                                    />
                                    <i className="icon icon-calendar" onClick={fetchData}></i>
                                </div>
                            </a>
                        </div>
                    </div>

                    <button className="arrow-btn" onClick={handleNextDateRange}>
                        <img src={IconArrowRight} alt="" />
                    </button>
                </div>
            </div>

            <div className='table-container'>
                {status === 'loading' ? (
                    <div className='loading-container'>
                        <img src={IconRefresh} alt="" className='loading-icon' />
                    </div>
                ) : (
                    <>
                        {dateRange === THREE_DAYS && (
                            <>
                                {todayCalls.length > 0 && (
                                    <CellTable
                                        calls={todayCalls}
                                        hoveredCallId={hoveredCallId}
                                        recordingUrl={recordingUrl}
                                        handleMouseEnter={handleMouseEnter}
                                        handleMouseLeave={handleMouseLeave}
                                        setSortBy={setSortBy}
                                        setOrder={setOrder}
                                        order={order}
                                        formatPhoneNumber={formatPhoneNumber}
                                        getCallStatusOrError={getCallStatusOrError}
                                    />
                                )}

                                {yesterdayCalls.length > 0 ? (
                                    <>
                                        <div className="yesterday-container">
                                            <h3 className='yesterday-header'>Вчера <sup>{yesterdayCalls.length}</sup></h3>
                                        </div>

                                        <CellTable
                                            calls={yesterdayCalls}
                                            hoveredCallId={hoveredCallId}
                                            recordingUrl={recordingUrl}
                                            handleMouseEnter={handleMouseEnter}
                                            handleMouseLeave={handleMouseLeave}
                                            setSortBy={setSortBy}
                                            setOrder={setOrder}
                                            order={order}
                                            formatPhoneNumber={formatPhoneNumber}
                                            getCallStatusOrError={getCallStatusOrError}
                                            hiddenHeader
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="yesterday-container">
                                            <h3 className='yesterday-header'>Вчера <sup>{yesterdayCalls.length}</sup></h3>
                                        </div>
                                        <div className="no-records">{NO_RECORDS}</div>
                                    </>
                                )}

                                {dayBeforeYesterdayCalls.length > 0 ? (
                                    <>
                                        <div className="yesterday-container">
                                            <h3 className='yesterday-header'>Позавчера <sup>{dayBeforeYesterdayCalls.length}</sup></h3>
                                        </div>
                                        <CellTable
                                            calls={dayBeforeYesterdayCalls}
                                            hoveredCallId={hoveredCallId}
                                            recordingUrl={recordingUrl}
                                            handleMouseEnter={handleMouseEnter}
                                            handleMouseLeave={handleMouseLeave}
                                            setSortBy={setSortBy}
                                            setOrder={setOrder}
                                            order={order}
                                            formatPhoneNumber={formatPhoneNumber}
                                            getCallStatusOrError={getCallStatusOrError}
                                            hiddenHeader
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="yesterday-container">
                                            <h3 className='yesterday-header'>Позавчера <sup>{dayBeforeYesterdayCalls.length}</sup></h3>
                                        </div>
                                        <div className="no-records">{NO_RECORDS}</div>
                                    </>
                                )}
                            </>
                        )}

                        {dateRange === WEEK && (
                            getWeekDays().map(day => {
                                const dayCalls = calls.filter(call => call.date.split(' ')[0] === day.toISOString().split('T')[0]);
                                return (
                                    <div key={day.toISOString().split('T')[0]}>
                                        {dayCalls.length > 0 ? (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>{day.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })} <sup>{dayCalls.length}</sup></h3>
                                                </div>
                                                <CellTable
                                                    calls={dayCalls}
                                                    hoveredCallId={hoveredCallId}
                                                    recordingUrl={recordingUrl}
                                                    handleMouseEnter={handleMouseEnter}
                                                    handleMouseLeave={handleMouseLeave}
                                                    setSortBy={setSortBy}
                                                    setOrder={setOrder}
                                                    order={order}
                                                    formatPhoneNumber={formatPhoneNumber}
                                                    getCallStatusOrError={getCallStatusOrError}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>{day.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })} <sup>{dayCalls.length}</sup></h3>
                                                </div>
                                                <div className="no-records">{NO_RECORDS}</div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {dateRange === MONTH && (
                            getWeeksOfMonth().map((startOfWeek, index) => {
                                const endOfWeek = new Date(startOfWeek);
                                endOfWeek.setDate(startOfWeek.getDate() + 6);
                                const weekCalls = calls.filter(call => {
                                    const callDate = new Date(call.date.split(' ')[0]);
                                    return callDate >= startOfWeek && callDate <= endOfWeek;
                                });
                                return (
                                    <div key={index}>
                                        {weekCalls.length > 0 ? (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>Неделя {index + 1}: {startOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' })} - {endOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' })} <sup>{weekCalls.length}</sup></h3>
                                                </div>
                                                <CellTable
                                                    calls={weekCalls}
                                                    hoveredCallId={hoveredCallId}
                                                    recordingUrl={recordingUrl}
                                                    handleMouseEnter={handleMouseEnter}
                                                    handleMouseLeave={handleMouseLeave}
                                                    setSortBy={setSortBy}
                                                    setOrder={setOrder}
                                                    order={order}
                                                    formatPhoneNumber={formatPhoneNumber}
                                                    getCallStatusOrError={getCallStatusOrError}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>Неделя {index + 1}: {startOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' })} - {endOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' })} <sup>{weekCalls.length}</sup></h3>
                                                </div>
                                                <div className="no-records">{NO_RECORDS}</div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {dateRange === YEAR && (
                            getMonthsOfYear().map((month, index) => {
                                const monthCalls = calls.filter(call => {
                                    const callDate = new Date(call.date.split(' ')[0]);
                                    return callDate.getMonth() === month.getMonth() && callDate.getFullYear() === month.getFullYear();
                                });
                                return (
                                    <div key={index}>
                                        {monthCalls.length > 0 ? (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>{MONTH_NAMES_IN_RUSSIAN[month.getMonth()]} <sup>{monthCalls.length}</sup></h3>
                                                </div>
                                                <CellTable
                                                    calls={monthCalls}
                                                    hoveredCallId={hoveredCallId}
                                                    recordingUrl={recordingUrl}
                                                    handleMouseEnter={handleMouseEnter}
                                                    handleMouseLeave={handleMouseLeave}
                                                    setSortBy={setSortBy}
                                                    setOrder={setOrder}
                                                    order={order}
                                                    formatPhoneNumber={formatPhoneNumber}
                                                    getCallStatusOrError={getCallStatusOrError}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className="yesterday-container">
                                                    <h3 className='yesterday-header'>{MONTH_NAMES_IN_RUSSIAN[month.getMonth()]} <sup>{monthCalls.length}</sup></h3>
                                                </div>
                                                <div className="no-records">{NO_RECORDS}</div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {dateRange === CUSTOM_DATE && (
                            <>
                                {getSelectedDateCalls().length > 0 ? (
                                    <CellTable
                                        calls={getSelectedDateCalls()}
                                        hoveredCallId={hoveredCallId}
                                        recordingUrl={recordingUrl}
                                        handleMouseEnter={handleMouseEnter}
                                        handleMouseLeave={handleMouseLeave}
                                        setSortBy={setSortBy}
                                        setOrder={setOrder}
                                        order={order}
                                        formatPhoneNumber={formatPhoneNumber}
                                        getCallStatusOrError={getCallStatusOrError}
                                    />
                                ) : (
                                    <div className="no-records">{NO_RECORDS}</div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CallList;