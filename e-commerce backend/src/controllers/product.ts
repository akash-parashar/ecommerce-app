// import { faker } from "@faker-js/faker";
import { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import NodeCache from "node-cache";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/feature.js";



//get latest product
//revalidate on new,update,delete product & new order
export const getlatestProducts = tryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products") as string);
  } else {
    products = await Product.find({}).sort({ created: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  if (!products) return next(new ErrorHandler("Product Not Found", 404));

  return res.status(200).json({
    success: true,
    products,
  });
});

//get all catergories
//revalidate on new,update,delete product & new order

export const getAllCategories = tryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    myCache.set("categores", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// get admin only products
export const getAdminProducts = tryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("all-products") as string);
  } else {
    products = await Product.find({});
    if (!products) return next(new ErrorHandler("Product Not Found", 404));
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

//get single product
export const getSingleProduct = tryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id
  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
      product = await Product.findById(id);
      if (!product) return next(new ErrorHandler("Product Not Found", 404));
      myCache.set(`product-${id}`, JSON.stringify(product));
      }

 
  return res.status(200).json({
    success: true,
    product,
  });
});

//create new product
export const newProduct = tryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photos = req.file;

    if (!photos) return next(new ErrorHandler("Please add Photo", 400));

    // if (photos.length < 1)
    //   return next(new ErrorHandler("Please add atleast one Photo", 400));

    // if (photos.length > 5)
    //   return next(new ErrorHandler("You can only upload 5 Photos", 400));

    if (!name || !price || !stock || !category) {
      rm(photos.path, () => {
        console.log("delted");
      });
      return next(new ErrorHandler("Please enter All Fields", 400));
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photos: photos?.path,
    });

    invalidateCache({ product: true, productId:String(product._id) });

    console.log(req.body, req.file);
    return res.status(201).json({
      success: true,
      message: "product successfully created",
    });
  }
);

//update product conteroller
export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  // if (!photo) return next(new ErrorHandler("Please add Photo", 400));

  // if (photo.length < 1)
  //   return next(new ErrorHandler("Please add atleast one Photo", 400));

  // if (photo.length > 5)
  //   return next(new ErrorHandler("You can only upload 5 Photo", 400));

  if (photo) {
    rm(product.photos!, () => {
      console.log("old phooto delted");
    });
    product.photos = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  // if (description) product.description = description;

  await product.save();
  
  invalidateCache({ product: true, productId:String(product._id),admin:true });
  //2:25;48
  console.log(req.body, req.file);
  return res.status(200).json({
    success: true,
    message: "product updated successfully ",
  });//4:51
});

//delete a product
export const deleteProduct = tryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photos!, () => {
    console.log("product phooto deleted");
  });

  await product.deleteOne();
  
  invalidateCache({ product: true, productId:String(product._id),admin:true });

  return res.status(200).json({
    success: true,
    message: "product deleted successfully",

    product,
  });
});

//get all products
export const getAllProducts = tryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};
    if (search) {
      baseQuery.name = { $regex: search, $options: "i" };
    }

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    // if (!products) return next(new ErrorHandler("Product Not Found", 404));

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

//generate random products

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photos: "uploads\\93d15772-968b-4145-9a7d-1b37886a5454.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };
// generateRandomProducts(40);

//delete random products
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// deleteRandomsProducts()
