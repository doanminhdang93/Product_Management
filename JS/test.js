$(document).ready(function() {
    getProductList();
});

function getProductList(){
    $.ajax({
        url: `http://localhost:8081/product`,
        type: "GET",
        dataType: "json",
        //async : true,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            console.log(response);
            // debugger;
            RenderProductTable(response);
        },
        error: function(error){
            console.log(error);
        }
    })
    // services.getWithAuthencation("product").then(function(response){
    //     console.log(response);
    //     RenderProductTable(response);
    // });
}

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
    //debugger;
    // $('input[name="productType"]').each(function(i,element){
    //     if(element.checked  === true)
    //     product.type.push(element.value)
    // });
    if(productId){
        $.ajax( 
            {
                url : `http://localhost:8081/product/${productId}`,
                type : "PUT",
                dataType: "json",
                async : false,
                data : JSON.stringify(product),
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    getProductList();
                },
                error : function(error){
                    console.log(error);
                }
            }
        );
    }
    else{        
        $.ajax(
            {
                url : `http://localhost:8081/product`,
                type : "POST",
                dataType: "json",
                async : false,
                data : JSON.stringify(product),
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    getProductList();
                },
                error : function(error){
                    console.log(error);
                }
            }
        );
    } 
    $("#productForm").trigger("reset");
    //RenderProductTable();
    
}

// function FindMaxId (){
//     var max = 0;
//     danhSachSanPham.forEach(element => {
//         if(element.id > max)
//           max = element.id;
//     });
//     return max;
// }

function SearchProduct(){
    getProductList();
}

function DeleteById(id){
    $.ajax(
        {
            url : `http://localhost:8081/product/${id}`,
            type : "DELETE",
            dataType: "json",
            async : false,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                getProductList();
            },
            error : function(error){
                console.log(error);
            }
        }
    );
}

function RenderProductTable(productList){
    $("#tableBody").html("");
    for (let index = 0; index < productList.length; index++) {
        $("#tableBody").append( 
        `<tr>
            <th scope="row">${index + 1}</th>
            <th>${productList[index].code}</th>
            <th>${productList[index].name}</th>
            <th>${productList[index].price}</th>
            <th>${productList[index].unit}</th>
            <th>
                <button class="btn btn-primary" onClick = GetProductById(${productList[index].id})><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onClick = DeleteById(${productList[index].id})><i class="bi bi-trash"></i></button>
            </th>
        </tr>`
        );        
    }
}

function GetProductById(id){
    $.ajax(
        {
            url : `http://localhost:8081/product/${id}`,
            type : "GET",
            dataType: "json",
            async : false,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var productTypeChecked = $("[name='productType']");
                $("#productName").val(response.name);
                $("#productCode").val(response.code);
                $("#productPrice").val(response.price);
                $("#productId").val(response.id);
                for (const checkbox of productTypeChecked) {
                    checkbox.checked = response.type.includes(checkbox.value);
                }
            },
            error : function(error){
                console.log(error);
            }
        }
    );
}
