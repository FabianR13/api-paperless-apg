import Customer from "../../../models/General/Customer";

export const signCustomer =async (req, res) => {
    const {
        name,
    } = req.body;
    const newCustomer =new Customer ({
        name,
    });

    const savedCustomer = await newCustomer.save();
    // console.log(savedCustomer);

    res.json({status: "200", message: "Customer created", savedCustomer});
};
// Getting all customers
export const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort({name: 1});
    res.json({status: "200", message: "Customers loaded", body: customers});
  }