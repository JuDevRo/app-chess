import '../styles/Tile.css'

interface Props {
    image?: string;
    number: number;
}

const Tile = ({number, image}: Props) => {
    if (number % 2 === 0) {
        return <div className="tile black-tile">
                    {image && <div className="chess-piece" style={{backgroundImage: `url(${image})`}}></div>}
                </div>
    } else {
        return <div className="tile white-tile">
                    {image && <div className="chess-piece" style={{backgroundImage: `url(${image})`}}></div>}
                </div>
        
    }
}

export default Tile