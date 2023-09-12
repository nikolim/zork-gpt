import './styles/Header.css';

interface HeaderProps {
    location: string;
    inventory: string;
}

function Header(props: HeaderProps) {
    return (
        <div className="Header">
            <p className="left">{props.location}</p>
            <p className="right">Inventory: {props.inventory}</p>
        </div>
    );
}

export default Header;
