import style from './footer.module.css';

function Footer() {
    return (
        <footer className={style.footer}>
            <p aria-label='© 2026 Sidekick. All rights reserved.'>
                <span aria-hidden='true'>© 2026 sidekick</span>
            </p>
        </footer>
    );
}

export default Footer;
