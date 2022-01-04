const Stocks = (props) => {
  return (
    <>
      <main style={{ marginTop: "30px", padding: "10px" }}>
        <div className="row row-cols-2 row-cols-md-3 mb-3 text-center">
          {props.stocks.map((stock) => (
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm">
                <div className="card-header py-3">
                  <h4 className="my-0 fw-normal">${stock.price}</h4>
                </div>
                <div className="card-body">
                  <h1 className="card-title pricing-card-title">
                    {stock.percentage}%
                  </h1>
                  <ul className="list-unstyled mt-3 mb-4">
                    <li>
                      <b>Entitlements</b>
                    </li>
                    {stock.percentage > 10 ? (
                      <li>1 Voting right</li>
                    ) : (
                      <li>No entitlements</li>
                    )}
                  </ul>

                  {!stock.isBought && (
                    <button
                      type="button"
                      className="w-100 btn btn-lg btn-outline-primary"
                      onClick={() => props.buyShares(stock.index)}
                    >
                      Buy Shares
                    </button>
                  )}
                  {props.address === stock.owner && stock.isBought && (
                    <button
                      type="button"
                      className="w-100 btn btn-lg btn-outline-primary"
                      onClick={() => props.sellShares(stock.index)}
                    >
                      Sell Shares
                    </button>
                  )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Stocks;
