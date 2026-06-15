-- 04_triggers.sql
-- Triggers for IDs and business logic

-- Users Trigger
CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF :NEW.user_id IS NULL THEN
    SELECT seq_users_id.NEXTVAL INTO :NEW.user_id FROM dual;
  END IF;
END;
/

-- Customers Trigger
CREATE OR REPLACE TRIGGER trg_customers_id
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
  IF :NEW.customer_id IS NULL THEN
    SELECT seq_customers_id.NEXTVAL INTO :NEW.customer_id FROM dual;
  END IF;
END;
/

-- Suppliers Trigger
CREATE OR REPLACE TRIGGER trg_suppliers_id
BEFORE INSERT ON suppliers
FOR EACH ROW
BEGIN
  IF :NEW.supplier_id IS NULL THEN
    SELECT seq_suppliers_id.NEXTVAL INTO :NEW.supplier_id FROM dual;
  END IF;
END;
/

-- Products Trigger
CREATE OR REPLACE TRIGGER trg_products_id
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
  IF :NEW.product_id IS NULL THEN
    SELECT seq_products_id.NEXTVAL INTO :NEW.product_id FROM dual;
  END IF;
END;
/

-- Orders Trigger
CREATE OR REPLACE TRIGGER trg_orders_id
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF :NEW.order_id IS NULL THEN
    SELECT seq_orders_id.NEXTVAL INTO :NEW.order_id FROM dual;
  END IF;
END;
/

-- Order Items Trigger
CREATE OR REPLACE TRIGGER trg_order_items_id
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  IF :NEW.order_item_id IS NULL THEN
    SELECT seq_order_items_id.NEXTVAL INTO :NEW.order_item_id FROM dual;
  END IF;
END;
/

-- Trigger to deduct stock after an order item is inserted
CREATE OR REPLACE TRIGGER trg_deduct_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - :NEW.quantity
  WHERE product_id = :NEW.product_id;
END;
/

-- Trigger to recalculate order total amount when item is added
CREATE OR REPLACE TRIGGER trg_update_order_total
AFTER INSERT OR UPDATE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total_amount = total_amount + :NEW.subtotal
  WHERE order_id = :NEW.order_id;
END;
/
