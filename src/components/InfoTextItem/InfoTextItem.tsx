import style from './infotextitem.module.css';
import { ReactComponent as InfoIcon } from '../../assets/icons/info-icon.svg';
import { InfoTextItemProps } from '../../types/props/InfoTextItemProps';

export default function InfoTextItem({ innerText }: InfoTextItemProps) {
    return (
        <div className={style.textWrapper} role='note' aria-label='Information notice'>
            <InfoIcon className={style.infoIcon} aria-hidden='true' />
            <p>{innerText}</p>
        </div>
    );
}
