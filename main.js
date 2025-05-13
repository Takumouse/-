// グローバル変数の定義
let salesData = [];        // 元のデータ
let filteredData = [];     // フィルター適用後のデータ
let currentPage = 1;       // 現在のページ
const rowsPerPage = 10;    // 1ページあたりの行数
let sortColumn = 'id';     // ソート列
let sortDirection = 'desc'; // ソート方向
let pieChart = null;       // 円グラフのインスタンス
let barChart = null;       // 棒グラフのインスタンス
let lineChart = null;      // 線グラフのインスタンス

// JSONデータの読み込み
function loadSalesData() {
    // インラインデータ（フォールバック用）
    const fallbackData = [
        {
            "id": 100,
            "date": "2025-05-11",
            "product": "Bread",
            "category": "Food",
            "region": "East",
            "amount": 1367,
            "quantity": 4,
            "status": "保留中"
        },
        {
            "id": 99,
            "date": "2025-05-10",
            "product": "Milk",
            "category": "Food",
            "region": "North",
            "amount": 7196,
            "quantity": 5,
            "status": "完了"
        },
        {
            "id": 98,
            "date": "2025-05-09",
            "product": "Headphones",
            "category": "Electronics",
            "region": "North",
            "amount": 9761,
            "quantity": 5,
            "status": "保留中"
        },
        {
            "id": 97,
            "date": "2025-05-08",
            "product": "Bread",
            "category": "Food",
            "region": "West",
            "amount": 5806,
            "quantity": 5,
            "status": "完了"
        },
        {
            "id": 96,
            "date": "2025-05-07",
            "product": "Headphones",
            "category": "Electronics",
            "region": "Central",
            "amount": 5307,
            "quantity": 6,
            "status": "保留中"
        },
        {
            "id": 95,
            "date": "2025-05-06",
            "product": "Lamp",
            "category": "Home",
            "region": "Central",
            "amount": 4346,
            "quantity": 4,
            "status": "保留中"
        },
        {
            "id": 94,
            "date": "2025-05-05",
            "product": "Novel",
            "category": "Books",
            "region": "Central",
            "amount": 6225,
            "quantity": 3,
            "status": "キャンセル"
        },
        {
            "id": 93,
            "date": "2025-05-04",
            "product": "Novel",
            "category": "Books",
            "region": "Central",
            "amount": 1061,
            "quantity": 5,
            "status": "保留中"
        },
        {
            "id": 92,
            "date": "2025-05-03",
            "product": "T-shirt",
            "category": "Clothing",
            "region": "South",
            "amount": 2895,
            "quantity": 2,
            "status": "完了"
        },
        {
            "id": 91,
            "date": "2025-05-02",
            "product": "Jeans",
            "category": "Clothing",
            "region": "South",
            "amount": 8500,
            "quantity": 3,
            "status": "完了"
        },
        {
            "id": 90,
            "date": "2025-05-01",
            "product": "Sofa",
            "category": "Home",
            "region": "East",
            "amount": 95000,
            "quantity": 1,
            "status": "保留中"
        },
        {
            "id": 89,
            "date": "2025-04-30",
            "product": "Table",
            "category": "Home",
            "region": "North",
            "amount": 65000,
            "quantity": 1,
            "status": "完了"
        },
        {
            "id": 88,
            "date": "2025-04-29",
            "product": "Laptop",
            "category": "Electronics",
            "region": "West",
            "amount": 125000,
            "quantity": 1,
            "status": "完了"
        },
        {
            "id": 87,
            "date": "2025-04-28",
            "product": "Dress",
            "category": "Clothing",
            "region": "South",
            "amount": 12500,
            "quantity": 2,
            "status": "完了"
        },
        {
            "id": 86,
            "date": "2025-04-27",
            "product": "Cookbook",
            "category": "Books",
            "region": "North",
            "amount": 3200,
            "quantity": 4,
            "status": "保留中"
        },
        {
            "id": 85,
            "date": "2025-04-26",
            "product": "Coffee",
            "category": "Food",
            "region": "Central",
            "amount": 1850,
            "quantity": 3,
            "status": "完了"
        }
    ];

    // 複数のパスを試す
    const possiblePaths = [
        'data/sales-data.json', // 最初のパス
        'data/sales.json',      // 2番目のパス
        './data/sales-data.json', // 相対パス1
        './data/sales.json'      // 相対パス2
    ];

    // パスを順番に試す関数
    function tryLoadingFromPath(pathIndex) {
        if (pathIndex >= possiblePaths.length) {
            // すべてのパスを試して失敗した場合、フォールバックを使用
            console.warn('全てのパスでJSONファイルの読み込みに失敗しました。フォールバックデータを使用します。');
            salesData = fallbackData;
            initializeData();
            return;
        }

        const path = possiblePaths[pathIndex];
        console.log(`パス ${path} からのJSONファイル読み込みを試行中...`);
        
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`パス ${path} からJSONデータ読み込み成功:`, data.length, '件のレコード');
                salesData = data;
                initializeData();
            })
            .catch(error => {
                console.warn(`パス ${path} からのJSONファイル読み込みに失敗しました:`, error);
                // 次のパスを試す
                tryLoadingFromPath(pathIndex + 1);
            });
    }

    // 最初のパスから試行開始
    tryLoadingFromPath(0);
}
