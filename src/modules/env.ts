export const isNodeProdcution = process.env.NODE_ENV === 'production';
export const basename = isNodeProdcution ? process.env.REACT_APP_NAME : '';
