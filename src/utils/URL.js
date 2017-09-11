const encodeLink = (link) =>
  encodeURI(link)
    .replace(/\(/i, "%28")
    .replace(/\)/i, "%29")

module.exports = {
  encodeLink,
}
