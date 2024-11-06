// Helper: Render error page with message
const renderErrorPage = (res, error) => {
    console.error(error);
    return res.status(500).render("error", { error });
};

module.exports = renderErrorPage;