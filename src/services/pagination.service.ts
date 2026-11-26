const dishesPerPage = 50

export function getPagination(dishes : Object[])
{
    return {"items" : dishes , "total" : dishes.length, "page" : getPage(dishes), "pageSize" : dishesPerPage}
}

function getPage(dishes : Object[])
{
    return dishes.length % dishesPerPage !== 0 ? dishes.length / dishesPerPage +1 : dishes.length / dishesPerPage  
}
