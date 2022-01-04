import { useState } from "react";

const AddStock = (props) => {
  const [percentage, setPercentage] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.addStocks(percentage, price);
  };
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <h3>Add Stock</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Percentage of Stake
                </label>
                <input
                  type="text"
                  onChange={(e)=>setPercentage(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Amount
                </label>
                <input
                  type="text"
                  onChange={(e)=>setPrice(e.target.value)}
                  className="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
        {/*.row */}
      </div>
      {/*.container */}
    </section>
  );
};

export default AddStock;
