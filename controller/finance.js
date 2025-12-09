const Budget = require("../models/budget");


module.exports.finance =  async (req,res)=>{
    let txs = [];
      if (req.user) {
      txs = await Budget.find({ owner: req.user._id }).sort({ createdAt: -1 });
      }
    res.render("retires/finance.ejs" , {txs} );
}

module.exports.addBudget = async (req ,res ,next)=>{

  const { desc, type, amount, forWhich } = req.body;

    const tx = await Budget.create({
      owner : req.user._id, 
      desc: desc,
      type: type,
      amount: amount,
      forWhich: forWhich
    });

    await tx.save();

   req.flash("success", "Expense/Income Added!!");
  res.redirect("/finance");
} 

module.exports.DestroyBud = async (req,res)=>{
    let {id} = req.params;
    let delList =  await  Budget.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success", "Transaction Cancelled!");
  res.redirect("/finance");
}

module.exports.ClearAll = async (req,res) => {
    await Budget.deleteMany({ owner : req.user._id });
     req.flash("error", "All Transactions are Removed!!");
    res.redirect("/finance");
}

