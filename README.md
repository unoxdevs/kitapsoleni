## Kitap Şöleni Web Sitesi
Kitap Şöleni, modern web teknolojileri kullanılarak geliştirilmiş bir kitap platformudur. Bu platformda kitaplar hakkında bilgi alabilir, kitaplara yorum yapabilir ve kitapları değerlendirebilirsiniz. Ayrıca kitaplar hakkında yapılan yorumları ve verilen puanları görebilirsiniz. Kitap Şöleni, kitap okuma alışkanlığını artırmayı amaçlamaktadır.

### Kullanılan Teknolojiler
- Frontend: SvelteKit
- Backend: Pocketbase
- Veritabanı: Pocketbase
- Dağıtım: Netlify

### Kurulum
#### Proje kurulumu
```bash
# Projeyi klonlayın
git clone https://github.com/unoxdevs/kitapsoleni

# Bağımlılıkları yükleyin
bun install

# Geliştirme sunucusunu başlatın
bun dev
```
- Bir `.env` dosyası oluşturun ve aşağıdaki değerleri ekleyin:
```bash
VITE_APP_PBURL=
# Buraya Pocketbase URL'si gelecek.
```
#### Pocketbase kurulumu
1. [Pocketbase](https://pocketbase.io/) adresine gidin ve sunucuyu bilgisayarınıza veya sunucunuza kurun.
2. Pocketbase hesabınızı oluşturun.
3. Pocketbase hesabınızda yeni bir proje oluşturun.
4. Veritabanındaki `users` tablosu değerleri aşağıdaki gibi olacaktır:
```json
{
    "username": "", // string
    "email": "", // string
    "emailVisibility": false, // boolean
    "password": "", // string
    "passwordConfirm": "", // string
    "name": "", // string
    "admin": false // boolean
}
```
5. Veritabanındaki `books` tablosu değerleri aşağıdaki gibi olacaktır:
```json
{
    "title": "", // string
    "description": "", // string
    "content": "", // string
    "link": "", // string
    "image": "", // string
    "tags": "JSON", // string
    "author": "", // string
    "authorId": "", // string
    "views": 0 // number
}
```
6. Veritabanındaki `comments` tablosu değerleri aşağıdaki gibi olacaktır:
```json
{
    "content": "", // string
    "blog": "", // string
    "user": "", // string
    "author": "" // string
}
```

### Yardım
Projenin kurulumu veya geliştirilmesi sırasında herhangi bir sorunla karşılaşırsanız, [buradan](https://t.me/unoxdevs) bize ulaşabilirsiniz.

### Katkıda Bulunma
Bu projeye katkıda bulunmak için şu adımları takip edebilirsiniz:
1. Bu projeyi forklayın
2. Yeni bir dal oluşturun (`git checkout -b feature/ozellik-adi`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik ekle'`)
4. Dalınıza push edin (`git push origin feature/ozellik-adi`)
5. Bir pull request oluşturun

### Lisans
Bu proje MIT Lisansı altında lisanslanmıştır.