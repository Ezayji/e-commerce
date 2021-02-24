import './BrandHeader.css';

const BrandHeader = ({ data }) => {
    return(
        <div className="brand-header" >
            <img src={data.logo_url} alt={data.title} />
            <div className='brand-desc' >
                <p>{data.description}</p>
            </div>
        </div>
    );
};
// <h2>{data.title}</h2>
export default BrandHeader;