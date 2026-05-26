import { useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './profile.module.css';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button/Button';
import { ReactComponent as UserIcon } from '../../assets/icons/user-icon.svg';
import { ReactComponent as LetterIcon } from '../../assets/icons/letter-icon.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil-icon.svg';
import { ReactComponent as FileIcon } from '../../assets/icons/file-icon.svg';
import Input from '../../components/UI/Input/Input';
import TextArea from '../../components/UI/TextArea/TextArea';
import ProfileItem from '../../components/ProfileItem/ProfileItem';
import { ThemeContext } from '../../context/ThemeContext';
import Toggle from '../../components/Toggle/Toggle';
import { NotesContext } from '../../context/NotesContext';
import InfoTextItem from '../../components/InfoTextItem/InfoTextItem';
import StatisticsCard from '../../components/StatisticsCard/StatisticsCard';
import { NoteStatus } from '../../types/notes/NoteStatus';
import { Note } from '../../types/notes/Note';
import Table from '../../components/StatsItems/Table/Table';
import NotesChart from '../../components/StatsItems/NotesChart/NotesChart';
import { calculateMoM } from '../../utils/calculateMoM';
import { useAuth } from '../../hooks/useAuth';
import { useNotesByStatus } from '../../hooks/useNotesByStatus';
import { ChartDataItem } from '../../types/chart/ChartDataItem';
import { useNotification } from '../../hooks/useNotification';
import { getAvatarPath } from '../../utils/getAvatarPath';

function Profile() {
    const { t, i18n } = useTranslation();

    const { currentUser, signOut, updateProfile } = useAuth();
    const { theme, toggleTheme, fontSizeRatio, updateFontSizeRatio } = useContext(ThemeContext)!;
    const { handleView, view, updateAllTodosBackground } = useContext(NotesContext)!;
    const { showNotification } = useNotification();

    const [username, setUsername] = useState(currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [description, setDescription] = useState(currentUser?.description || '');
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        getAvatarPath(currentUser) || undefined
    );
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

    const { data: activeNotes = [] } = useNotesByStatus('NOTES');
    const { data: archivedNotes = [] } = useNotesByStatus('ARCHIVED');
    const { data: trashNotes = [] } = useNotesByStatus('TRASH');

    const activeMoM = useMemo(() => calculateMoM(activeNotes), [activeNotes]);
    const archivedMoM = useMemo(() => calculateMoM(archivedNotes), [archivedNotes]);
    const trashMoM = useMemo(() => calculateMoM(trashNotes), [trashNotes]);

    const chartData = useMemo(() => {
        const dataMap: Record<string, ChartDataItem> = {};

        const parseNotes = (notes: Note[], type: NoteStatus) => {
            const statusKeyMap: Record<NoteStatus, 'active' | 'archived' | 'trash'> = {
                NOTES: 'active',
                ARCHIVED: 'archived',
                TRASH: 'trash',
            };

            const targetKey = statusKeyMap[type];

            notes.forEach((note) => {
                if (!note.createdAt) return;
                const date = new Date(note.createdAt);
                if (isNaN(date.getTime())) return;

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const monthSortKey = `${year}-${month}`;

                const name = date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
                    month: 'short',
                    year: 'numeric',
                });

                if (!dataMap[monthSortKey]) {
                    dataMap[monthSortKey] = {
                        monthSortKey,
                        name,
                        active: 0,
                        archived: 0,
                        trash: 0,
                    };
                }
                dataMap[monthSortKey][targetKey]++;
            });
        };

        parseNotes(activeNotes, 'NOTES');
        parseNotes(archivedNotes, 'ARCHIVED');
        parseNotes(trashNotes, 'TRASH');

        return Object.values(dataMap).sort((a, b) => a.monthSortKey.localeCompare(b.monthSortKey));
    }, [activeNotes, archivedNotes, trashNotes, i18n.language]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }

            setPhotoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showNotification(t('profile.bgSizeError'), 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            updateAllTodosBackground(base64String);
        };

        reader.readAsDataURL(file);
    };

    const handleUploadBgClick = () => {
        bgFileInputRef.current?.click();
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stringValue = e.target.value;

        if (stringValue === '') {
            updateFontSizeRatio(1);
            return;
        }

        const val = parseFloat(stringValue);
        if (isNaN(val)) return;

        if (val >= 0.8 && val <= 2) {
            updateFontSizeRatio(val);
        }
    };

    const handleSubmit = async () => {
        if (!username || !email || !description) {
            showNotification(t('profile.validationWarning'), 'warning');
            return;
        }

        const result = await updateProfile(
            {
                username,
                email,
                description,
            },
            photoFile || undefined
        );

        if (result) {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }

            setPhotoFile(null);
            showNotification(t('profile.updateSuccess'), 'success');
        } else {
            showNotification(t('profile.updateError'), 'error');
        }
    };

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const userFullName = `${currentUser?.firstName || ''} ${currentUser?.secondName || ''}`.trim();

    return (
        <Layout pageStatus='Authorized'>
            <ProfileItem expandContainerTitle={t('profile.infoSection')}>
                <div className={style.profileInfoWrapper}>
                    <div className={style.profileForm}>
                        <div className={style.profile}>
                            <img src={avatarPreview} alt={userFullName || t('profile.avatarAlt')} />
                            <div className={style.profileShortInfo}>
                                <p>{userFullName}</p>
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    className={style.fileInput}
                                    accept='image/*'
                                    onChange={handleFileChange}
                                />
                                <button type='button' onClick={handleChangePhotoClick}>
                                    {t('profile.changePhoto')}
                                </button>
                            </div>
                        </div>
                        <div className={style.inputs}>
                            <div className={style.inputWrapper}>
                                <label htmlFor='username'>
                                    <UserIcon className={style.userIcon} aria-hidden='true' />
                                    {t('profile.usernameLabel')}
                                </label>
                                <Input
                                    className={style.inputUsername}
                                    type='text'
                                    id='username'
                                    placeholder={t('profile.usernamePlaceholder')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className={style.inputWrapper}>
                                <label htmlFor='email'>
                                    <LetterIcon className={style.letterIcon} aria-hidden='true' />
                                    {t('profile.emailLabel')}
                                </label>
                                <Input
                                    className={style.inputEmail}
                                    type='email'
                                    id='email'
                                    placeholder={t('profile.emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={style.inputWrapper}>
                                <label htmlFor='description'>
                                    <PencilIcon className={style.perncilIcon} aria-hidden='true' />
                                    {t('profile.descriptionLabel')}
                                </label>
                                <TextArea
                                    className={style.inputDescription}
                                    id='description'
                                    placeholder={t('profile.descriptionPlaceholder')}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <InfoTextItem innerText={t('profile.descriptionInfo')} />
                            </div>
                        </div>
                        <div className={style.wrapperButton}>
                            <Button title={t('profile.saveButton')} onClick={handleSubmit} />
                        </div>
                    </div>
                    <div className={style.actions}>
                        <p className={style.actionsTitle}>{t('profile.actionsTitle')}</p>
                        <Button
                            onClick={() => {
                                signOut();
                                showNotification(t('profile.logoutSuccess'), 'success');
                            }}
                            title={t('profile.logoutButton')}
                        />
                    </div>
                </div>
            </ProfileItem>
            <ProfileItem
                expandContainerTitle={t('profile.statisticsSection')}
                className={style.statisticsSection}
            >
                <div className={style.statistics}>
                    <div className={style.statsCards}>
                        <StatisticsCard
                            title={t('profile.createdNotes')}
                            value={activeNotes.length}
                            percent={activeMoM}
                        />
                        <StatisticsCard
                            title={t('profile.archivedNotes')}
                            value={archivedNotes.length}
                            percent={archivedMoM}
                        />
                        <StatisticsCard
                            title={t('profile.deletedNotes')}
                            value={trashNotes.length}
                            percent={trashMoM}
                        />
                    </div>
                    <div className={style.statsVisualization}>
                        <p className={style.visualizationTitle}>
                            {t('profile.visualizationTitle')}
                        </p>
                        <div className={style.visualizationGroup}>
                            <Table data={chartData} />
                            <NotesChart data={chartData} />
                        </div>
                    </div>
                </div>
            </ProfileItem>
            <ProfileItem expandContainerTitle={t('profile.settingsSection')}>
                <div className={style.settings}>
                    <div className={style.toggleTheme}>
                        <Toggle
                            onClick={toggleTheme}
                            toggleTitle={t('profile.darkThemeToggle')}
                            isActive={theme === 'dark'}
                        />
                    </div>
                    <div className={style.fontSize}>
                        <label htmlFor='fontSize' className={style.inputLabel}>
                            {t('profile.fontSizeLabel')}
                        </label>
                        <Input
                            className={style.fontSizeInput}
                            type='number'
                            id='fontSize'
                            min='0.8'
                            max='2'
                            step='0.1'
                            placeholder={t('profile.fontSizePlaceholder')}
                            value={fontSizeRatio}
                            onChange={handleFontSizeChange}
                        />
                        <InfoTextItem innerText={t('profile.fontSizeInfo')} />
                    </div>
                    <div className={style.handleView}>
                        <Toggle
                            onClick={handleView}
                            toggleTitle={t('profile.listViewToggle')}
                            isActive={view === 'list'}
                        />
                        <InfoTextItem innerText={t('profile.listViewInfo')} />
                    </div>
                    <div className={style.uploadFieldWrapper}>
                        <input
                            type='file'
                            ref={bgFileInputRef}
                            className={style.fileInput}
                            accept='image/png, image/jpeg'
                            onChange={handleBgFileChange}
                        />
                        <button
                            type='button'
                            className={style.uploadField}
                            onClick={handleUploadBgClick}
                            aria-label={`${t('profile.uploadFieldMain')}. ${t('profile.uploadFieldSub')}`}
                        >
                            <FileIcon className={style.fileIcon} aria-hidden='true' />
                            <div className={style.description}>
                                <p>{t('profile.uploadFieldMain')}</p>
                                <p>{t('profile.uploadFieldSub')}</p>
                            </div>
                        </button>
                        <InfoTextItem innerText={t('profile.uploadBgInfo')} />
                    </div>
                    <div className={style.toggleLanguage}>
                        <Toggle
                            toggleTitle={t('profile.languageToggle')}
                            onClick={toggleLanguage}
                            isActive={i18n.language === 'ru'}
                        />
                    </div>
                </div>
            </ProfileItem>
        </Layout>
    );
}

export default Profile;
