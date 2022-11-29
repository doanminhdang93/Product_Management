$(document).ajaxStart(function () {
    $("#loading").show();
  })
  .ajaxStop(function () {
    $("#loading").hide();
});

$(document).ready(function() {
    RenderProductList();
})

function SaveProduct(){
    var productTypeChecked = $("[name='productType']");
    var  productId = $("#productId").val();
    var product = {
        name : $("#productName").val(),
        code : $("#productCode").val(),
        unit : $("#productUnit").val(),
        price : $("#productPrice").val(),
        importDate : $("#productImportDate").val(),
        description : $("#productDescription").val(),
        type : []
    };
    for (const checkbox of productTypeChecked) {
        if(checkbox.checked) {
            product.type.push(checkbox.value);
        }
    }

    if(productId){
        services.put(`product/${productId}`,product).then(function (response){
            RenderProductList();
        })
    }
    else{        
        services.post(`product`,product).then(function(response){
            RenderProductList();
        })
    } 
    $("#productForm").trigger("reset");
}

function DeleteById(id){
    services.delete(`product/${id}`).then(function(response){
        RenderProductList();
    })
}

function SearchProduct(){
    RenderProductList();
}

function RenderProductList(){
    $("#tableBody").html("");
    services.get(`product`).then(function (response) {
        response.forEach((product,index) =>{
            $("#tableBody").append( 
            `   <tr>
                    <th scope="row">${index + 1}</th>
                    <th>${product.code}</th>
                    <th>${product.name}</th>
                    <th>${product.price}</th>
                    <th>${product.unit}</th>
                    <th>${product.type}</th>
                    <th>
                        <button class="btn btn-primary" onClick = SearchProduct()><i class="bi bi-search"></i></button>
                        <button class="btn btn-primary" onClick = editProduct(${product.id})><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger" onClick = DeleteById(${product.id})><i class="bi bi-trash"></i></button>
                    </th>
                </tr>
            `
            );        
        }) 
    })
}

function editProduct(id){
    services.get(`product/${id}`).then(function (product) {
        $("#productId").val(product.id);
        $("#productName").val(product.name);
        $("#productDescription").val(product.description);
        $("#productCode").val(product.code);
        $("#productPrice").val(product.price);
        $("productImportDate").val(product.importDate);
        $("productUnit").val(product.unit);
        var productTypeChecked = $("[name = 'productType']");
        for (const checkbox of productTypeChecked) {
            if (product.type.includes(parseInt(checkbox.value))){
                checkbox.checked = true;
            }
            else checkbox.checked = false;
        }
    })
}
