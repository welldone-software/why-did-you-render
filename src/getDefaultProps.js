export default function getDefaultProps(type) {
  return (
    type.defaultProps ||
    (type.type && getDefaultProps(type.type)) ||
    (type.render && getDefaultProps(type.render)) ||
    {}
  );
}
