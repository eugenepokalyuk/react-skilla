/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ASC, DESC } from '../../utils/consts';
import CustomAudioPlayer from '../CustomAudioPlayer/CustomAudioPlayer';
import './CellTable.scss';

interface CellTableProps {
    calls: any[];
    hiddenHeader?: boolean;
    hoveredCallId: number | null;
    recordingUrl: string | null;
    handleMouseEnter: (call: any) => void;
    handleMouseLeave: () => void;
    setSortBy: (value: string) => void;
    setOrder: (value: string) => void;
    order: string;
    formatPhoneNumber: (phoneNumber: string) => string;
    getCallStatusOrError: (call: any) => JSX.Element | null;
}

const CellTable: React.FC<CellTableProps> = ({
    calls,
    hiddenHeader = false,
    hoveredCallId,
    recordingUrl,
    handleMouseEnter,
    handleMouseLeave,
    setSortBy,
    setOrder,
    order,
    formatPhoneNumber,
    getCallStatusOrError
}) => {
    const [visibleAudioPlayer, setVisibleAudioPlayer] = useState<number | null>(null);
    const [, setIsPlaying] = useState<boolean>(false);

    const handleSort = (field: string) => {
        setSortBy(field);
        setOrder(order === ASC ? DESC : ASC);
    };

    const handleAudioPlayerClose = () => {
        setVisibleAudioPlayer(null);
        setIsPlaying(false);
    };

    const handleAudioPlayerPlay = (callId: number) => {
        setVisibleAudioPlayer(callId);
        setIsPlaying(true);
    };

    return (
        <table className="call-list-table">
            {/* Скрываем заголовки если нужно */}
            <thead className={!hiddenHeader ? '' : 'hidden-header'}>
                <tr>
                    <th>Тип</th>
                    <th className={`sortable ${order}`} onClick={() => handleSort('date')}>
                        Время
                        <span className="caret"></span>
                    </th>
                    <th>Сотрудник</th>
                    <th>Звонок</th>
                    <th>Источник</th>
                    <th>Оценка</th>
                    <th className={`sortable ${order}`} onClick={() => handleSort('duration')}>
                        Длительность
                        <span className="caret"></span>
                    </th>
                </tr>
            </thead>
            {/* )} */}
            <tbody>
                {calls.map((call) => (
                    <tr
                        key={call.id}
                        className="call-row"
                        onMouseEnter={() => handleMouseEnter(call)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <td>
                            {call.in_out === 1 && <i className="icon icon-incoming"></i>}
                            {call.in_out === 0 && <i className="icon icon-outgoing"></i>}
                        </td>
                        <td>{new Date(call.date).toLocaleTimeString('ru-RU', { hour: "2-digit", minute: "2-digit" })}</td>
                        <td>
                            {call.person_avatar ? (
                                <img src={call.person_avatar} alt="Avatar" className="avatar" />
                            ) : call.person_name && call.person_surname ? (
                                <div className="avatar-placeholder">
                                    {call.person_name[0]}
                                    {call.person_surname[0]}
                                </div>
                            ) : (
                                <i className="icon icon-user"></i>
                            )}
                        </td>
                        <td>
                            {call.contact_name ? (
                                <>
                                    {call.contact_name}
                                    {call.contact_company && <span> ({call.contact_company})</span>}
                                    <br />
                                    {call.from_number.startsWith("sip:") ? (
                                        <a href={`mailto:${call.from_number}`}>Ссылка на Zoom</a>
                                    ) : (
                                        formatPhoneNumber(call.from_number)
                                    )}
                                </>
                            ) : call.from_number.startsWith("sip:") ? (
                                <>
                                    {call.person_name} {call.person_surname}
                                    <br />
                                    <a href={`mailto:${call.from_number}`}>Ссылка на Zoom</a>
                                </>
                            ) : (
                                formatPhoneNumber(call.from_number)
                            )}
                        </td>
                        <td className="source">{call.source}</td>
                        <td>{getCallStatusOrError(call)}</td>
                        <td className="duration">
                            {(hoveredCallId === call.id && recordingUrl && call.record) || (visibleAudioPlayer === call.id && call.record) ? (
                                <div className="audio-player">
                                    <CustomAudioPlayer
                                        src={recordingUrl!}
                                        onPlay={() => handleAudioPlayerPlay(call.id)}
                                        onClose={handleAudioPlayerClose}
                                    />
                                </div>
                            ) : (
                                `${Math.floor(call.time / 60).toString().padStart(2, "0")}:${(call.time % 60).toString().padStart(2, "0")}`
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CellTable;