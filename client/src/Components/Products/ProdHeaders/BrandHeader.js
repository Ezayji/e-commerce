import './BrandHeader.css';

const BrandHeader = ({ data }) => {
    return(
        <div className="brand-header" >
            <img src={data.logo_url} alt={data.title} />
            <div>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
            </div>
        </div>
    );
};

export default BrandHeader;