import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const NotificationService = {
  async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        const { display } = await LocalNotifications.requestPermissions();
        return display === 'granted';
      } else {
        // Tarayıcı (Bilgisayar) için izin iste
        if (!("Notification" in window)) return false;
        if (Notification.permission === "granted") return true;
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }
    } catch (error) {
      console.error('Bildirim izni alınırken hata oluştu:', error);
      return false;
    }
  },

  async cancelAllNotifications() {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });
      }
      console.log('Tüm yerel bildirimler iptal edildi.');
    } catch (error) {
      console.error('Bildirimler iptal edilirken hata oluştu:', error);
    }
  },

  async scheduleMealNotifications() {
    try {
      const isEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
      if (!isEnabled) {
        console.log('Bildirimler kullanıcı tarafından kapalı olduğu için zamanlanmadı.');
        return;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      // Eğer uygulamayı bilgisayarda (Web) çalıştırıyorsak test bildirimi atalım
      if (!Capacitor.isNativePlatform()) {
        console.log('Bilgisayarda test modundayız. 5 saniye sonra bildirim gelecek...');
        setTimeout(() => {
          if (localStorage.getItem('notificationsEnabled') !== 'false') {
            new window.Notification('TADORA - PC Test 💻', {
              body: 'Öğlen veya Akşam Yemeği vakti geldi! (Bu bir bilgisayar test bildirimidir)',
            });
          }
        }, 5000);
        return; // Sadece test at, aşağıdaki gerçek mobil saatlerini kurma
      }

      // ----------------------------------------------------
      // BURADAN AŞAĞISI SADECE TELEFONLAR İÇİN (Gerçek Saatler)
      // ----------------------------------------------------
      await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });

      const notifications = [
        {
          id: 1,
          title: 'Öğle Yemeği Vakti! 🥗',
          body: 'Öğle arası için hafif ama doyurucu bir şeyler mi arıyorsun? Günün pratik tarifine hemen göz at.',
          schedule: { 
            allowWhileIdle: true,
            on: { hour: 11, minute: 30 }
          }
        },
        {
          id: 2,
          title: 'Çayın Yanına Ne Gider? ☕',
          body: 'Fırından yeni çıkmış sıcacık bir keki kimse reddedemez. 5 dakikada hazırlayabileceğin tarifimiz burada.',
          schedule: { 
            allowWhileIdle: true,
            on: { hour: 15, minute: 30 }
          }
        },
        {
          id: 3,
          title: 'Akşama Ne Pişirsem? 🍲',
          body: 'Akşama ne pişireceğine karar veremedin mi? En çok denenen akşam yemekleri burada.',
          schedule: { 
            allowWhileIdle: true,
            on: { hour: 17, minute: 30 }
          }
        }
      ];

      await LocalNotifications.schedule({ notifications });
      console.log('Mobil için öğün bazlı gerçek bildirimler başarıyla ayarlandı.');
    } catch (error) {
      console.error('Bildirimler ayarlanırken hata oluştu:', error);
    }
  }
};
