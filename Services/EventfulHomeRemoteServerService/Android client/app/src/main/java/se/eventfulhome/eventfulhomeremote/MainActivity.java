package se.eventfulhome.eventfulhomeremote;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.EditTextPreference;
import android.preference.Preference;
import android.preference.PreferenceFragment;
import android.preference.PreferenceManager;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Toast;
import android.os.Vibrator;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private DrawerLayout mDrawerLayout;
    private ListView mDrawerList;
    private ActionBarDrawerToggle mDrawerToggle;
    private CharSequence mDrawerTitle;
    private CharSequence mTitle;
    private int mPosition;
    private SharedPreferences prefs;
    private SharedPreferences.OnSharedPreferenceChangeListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        prefs = PreferenceManager.getDefaultSharedPreferences(this);

        if (prefs.getString("taglabel1",null)==null){
            PreferenceManager.setDefaultValues(this,R.xml.preferences,false);
        }
        listener = new SharedPreferences.OnSharedPreferenceChangeListener() {
            public void onSharedPreferenceChanged(SharedPreferences prefs, String key) {
                updateMenu();
            }
        };
        prefs.registerOnSharedPreferenceChangeListener(listener);
        mTitle = mDrawerTitle = getTitle();
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mDrawerList = (ListView) findViewById(R.id.left_drawer);

        // set a custom shadow that overlays the main content when the drawer opens
        mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow, GravityCompat.START);

        // set up the drawer's list view with items and click listener
        updateMenu();
        mDrawerList.setOnItemClickListener(new DrawerItemClickListener());

        // enable ActionBar app icon to behave as action to toggle nav drawer
        getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);

        // ActionBarDrawerToggle ties together the the proper interactions
        // between the sliding drawer and the action bar app icon
        mDrawerToggle = new ActionBarDrawerToggle(
                this,                  /* host Activity */
                mDrawerLayout,         /* DrawerLayout object */
                R.drawable.ic_drawer,  /* nav drawer image to replace 'Up' caret */
                R.string.drawer_open,  /* "open drawer" description for accessibility */
                R.string.drawer_close  /* "close drawer" description for accessibility */
                ) {
            public void onDrawerClosed(View view) {
                getActionBar().setTitle(mTitle);
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            public void onDrawerOpened(View drawerView) {
                getActionBar().setTitle(mDrawerTitle);
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);

        if (savedInstanceState == null) {
            selectItem(0);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    /* Called whenever we call invalidateOptionsMenu() */
    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        // If the nav drawer is open, hide action items related to the content view
        boolean drawerOpen = mDrawerLayout.isDrawerOpen(mDrawerList);
        menu.findItem(R.id.action_refresh).setVisible(!drawerOpen);
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
         // The action bar home/up action should open or close the drawer.
         // ActionBarDrawerToggle will take care of this.
        updateMenu();

        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }
        // Handle action buttons
        switch(item.getItemId()) {
        case R.id.action_refresh:
            //update widgets
            // update the main content by replacing fragments
            Fragment fragment = new TagFragment();
            Bundle args = new Bundle();
            args.putInt(TagFragment.ARG_TAG_NUMBER, mPosition);
            args.putBoolean(TagFragment.ARG_REFRESH,true);
            fragment.setArguments(args);

            FragmentManager fragmentManager = getFragmentManager();
            fragmentManager.beginTransaction().replace(R.id.content_frame, fragment).commit();

            // update selected item and title, then close the drawer
            mDrawerList.setItemChecked(mPosition, true);
            setTitle(getTagLabelStringList().get(mPosition));
            mDrawerLayout.closeDrawer(mDrawerList);

            return true;
        default:
            return super.onOptionsItemSelected(item);
        }
    }

    /* The click listner for ListView in the navigation drawer */
    private class DrawerItemClickListener implements ListView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            selectItem(position);
        }
    }

    public void updateMenu(){
        mDrawerList.setAdapter(new ArrayAdapter<String>(this,
                R.layout.drawer_list_item, getTagLabelStringList()));
    }

    private void selectItem(int position) {
        //Check if settings or tag fragment should be loaded
        mPosition=position;

        if (position==8){
            // Display the fragment as the main content.
            getFragmentManager().beginTransaction()
                    .replace(R.id.content_frame, new SettingsFragment())
                    .commit();
            setTitle("Settings");
            mDrawerList.setItemChecked(position, true);
            mDrawerLayout.closeDrawer(mDrawerList);
        }else
        {

            // update the main content by replacing fragments
            Fragment fragment = new TagFragment();
            Bundle args = new Bundle();
            args.putInt(TagFragment.ARG_TAG_NUMBER, position);
            args.putBoolean(TagFragment.ARG_REFRESH,false);
            fragment.setArguments(args);

            FragmentManager fragmentManager = getFragmentManager();
            fragmentManager.beginTransaction().replace(R.id.content_frame, fragment).commit();

            // update selected item and title, then close the drawer
            mDrawerList.setItemChecked(position, true);
            setTitle(getTagLabelStringList().get(position));
            mDrawerLayout.closeDrawer(mDrawerList);
        }
    }

    @Override
    public void setTitle(CharSequence title) {
        mTitle = title;
        getActionBar().setTitle(mTitle);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        // Sync the toggle state after onRestoreInstanceState has occurred.
        mDrawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Pass any configuration change to the drawer toggls
        mDrawerToggle.onConfigurationChanged(newConfig);
        updateMenu();
    }

    public ArrayList<String> getTagLabelStringList(){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        ArrayList<String> tTagLabels = new ArrayList<String>();
        for (int i = 0; i < 8; i++) {
            tTagLabels.add(sharedPref.getString("taglabel"+i, ""));
        }
        tTagLabels.add("Settings");
        return tTagLabels;
    }

    public static class SettingsFragment extends PreferenceFragment {
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            addPreferencesFromResource(R.xml.preferences);

            //Find serverurl setting and listen for changes
            EditTextPreference editTextPreference = (EditTextPreference) findPreference("serverurl");
            editTextPreference.setSummary(editTextPreference.getText());
            editTextPreference.setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
                @Override
                public boolean onPreferenceChange(Preference preference, Object newValue) {
                    preference.setSummary(newValue.toString());
                    return true;
                }
            });

            //Find tag settings and listen for changes
            for (int i=0;i<8;i++){
                editTextPreference = (EditTextPreference) findPreference("taglabel"+i);
                editTextPreference.setSummary(editTextPreference.getText());
                editTextPreference.setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
                    @Override
                    public boolean onPreferenceChange(Preference preference, Object newValue) {
                        preference.setSummary(newValue.toString());
                        return true;
                    }
                });
                editTextPreference = (EditTextPreference) findPreference("tagmatchstring"+i);
                editTextPreference.setSummary(editTextPreference.getText());
                editTextPreference.setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
                    @Override
                    public boolean onPreferenceChange(Preference preference, Object newValue) {
                        preference.setSummary(newValue.toString());
                        return true;
                    }
                });
            }
        }
    }

    //TODO: bug - widgets doesn't appear on app load
    //TODO: handle local calls (tasker)
    //TODO: handle local call (close) ?
    //TODO: create separate search fragment?
    //TODO: handle search calls
    //TODO: any way of allowing html to use websocket?
    //TODO: how to handle css "globally"?
    //TODO: add local variables capability?
    //TODO: make widget corners round? http://blog.lardev.com/2011/05/20/android-view-rounded-corners/
    //TODO: add space between boarder and widget content

    public class TagFragment extends Fragment {
        public static final String ARG_TAG_NUMBER = "tag_number";
        public static final String ARG_REFRESH="refresh";
        public LinearLayout mLayout;
        public View rootView;
        public String mTagMatchString;
        public String mTagLabel;

        public TagFragment() {
            // Empty constructor required for fragment subclasses
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {

            rootView = inflater.inflate(R.layout.fragment_tag, container, false);

            //Get tag and set title
            SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(getActivity());
            int i = getArguments().getInt(ARG_TAG_NUMBER);
            boolean refresh=getArguments().getBoolean(ARG_REFRESH);

            mTagLabel = sharedPref.getString("taglabel"+i, "");
            getActivity().setTitle(mTagLabel);

            mTagMatchString=sharedPref.getString("tagmatchstring"+i,"");

            //load
            loadWidgets(refresh);

            return rootView;
        }

        public void loadWidgets(final boolean forceRefresh){
            new Thread(new Runnable() {
                public void run() {
                    JSONObject tJSONObject=null;

                    //Check if we have a local cache
                    File jsonFile=new File(getCacheDir(),"jsoncache.json");
                    if (!jsonFile.exists() || forceRefresh){

                        //make sync http call to get the JSON-structure
                        try {
                            tJSONObject=retrieveWidgetJSON();
                            //Save the retrieved JSON in the cache
                            if (tJSONObject==null){
                                throw new Exception();
                            }
                            ObjectOutput out=new ObjectOutputStream(new FileOutputStream(jsonFile));
                            out.writeObject(tJSONObject.toString());
                            out.close();
                        } catch (Exception e) {
                            rootView.post(new Runnable() {
                                public void run() {
                                    Toast.makeText(getApplicationContext(), "Error in retrieving Widget data.", Toast.LENGTH_LONG).show();
                                }
                            });
                            e.printStackTrace();
                        }

                    }else{
                        //If not or forceRefresh=true - call to retrieve and store local cache file
                        try {
                            ObjectInputStream in = new ObjectInputStream(new FileInputStream(jsonFile));
                            tJSONObject = new JSONObject(in.readObject().toString());
                            in.close();
                        } catch (Exception e) {
                            //Toast.makeText(getApplicationContext(),"Error in loading widgets.", Toast.LENGTH_LONG);
                            e.printStackTrace();
                        }
                    }

                    //Filter json objects based on tag filter and add the subset of widgets
                    try {
                        JSONObject filteredJSONObj=filterJSONObjects(tJSONObject, mTagMatchString);

                        if(filteredJSONObj!=null)
                            addWidgetsToLayout(filteredJSONObj);
                    } catch (Exception e) {
                        rootView.post(new Runnable() {
                            public void run() {
                                Toast.makeText(getApplicationContext(), "Problems with adding widgets to list", Toast.LENGTH_LONG).show();
                            }
                        });
                        e.printStackTrace();
                    }
                }
            }).start();
        }

        public JSONObject filterJSONObjects(JSONObject inJSONObject, String filterString) throws Exception {
            JSONObject filteredJSON = new JSONObject();
            JSONArray filterArray=new JSONArray();
            JSONArray jData = inJSONObject.getJSONArray("widgets");
            String[] filters=filterString.split(",");

            for (int i = 0; i < jData.length(); i++) {
                JSONObject jo = jData.getJSONObject(i);
                for (String filter : filters) {
                    if ((jo.getString("name")).contains(filter)) {
                        filterArray.put(jo);
                    }
                }
            }
            filteredJSON.put("widgets",filterArray);
            return filteredJSON;
        }

        public void addWidgetsToLayout(final JSONObject subsetOfWidgets) {
            rootView.post(new Runnable() {
                @Override
                public void run() {
                    mLayout=(LinearLayout)rootView.findViewById(R.id.linlay);
                    mLayout.setOrientation(LinearLayout.VERTICAL);
                    LinearLayout.LayoutParams tWVLayout=new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    tWVLayout.setMargins(12, 6, 12, 6);
                    String htmlString;
                    WebView tWView;

                    JSONArray jData = null;
                    try {
                        jData = subsetOfWidgets.getJSONArray("widgets");
                        for (int i = 0; i < jData.length(); i++) {
                            JSONObject jo = jData.getJSONObject(i);
                            htmlString=jo.getString("htmlstring");
                            tWView = new WebView(getActivity());
                            tWView.setWebViewClient(new WebViewClient() {
                                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                                    view.loadUrl(url);
                                    return false;
                                }
                            });
                            tWView.addJavascriptInterface(new WebAppInterface(getApplicationContext()),"Android");
                            tWView.loadData(htmlString, "text/html", null);
                            tWView.getSettings().setJavaScriptEnabled(true);
                            tWView.getSettings().setLoadWithOverviewMode(true);
                            tWView.getSettings().setUseWideViewPort(true);
                            tWView.setHorizontalScrollBarEnabled(false);
                            mLayout.addView(tWView, tWVLayout);
                        }
                    } catch (JSONException e) {
                        //Toast.makeText(getApplicationContext(), "Problems with creating widgets", Toast.LENGTH_LONG);
                        e.printStackTrace();
                    }
                }
            });
        }

        public JSONObject retrieveWidgetJSON(){
            JSONObject jsonObject=new JSONObject();
            JSONArray jsonArray=null;

            SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
            String serverUrl=sharedPref.getString("serverurl", "");
            serverUrl+="/getwidgets/";

            try {
                DefaultHttpClient defaultClient = new DefaultHttpClient();
                HttpGet httpGetRequest = new HttpGet(serverUrl);
                HttpResponse httpResponse = defaultClient.execute(httpGetRequest);
                BufferedReader reader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
                String json = reader.readLine();
                jsonArray = new JSONArray(json);
                jsonObject.put("widgets",jsonArray);
            }catch (Exception e){
                //Toast.makeText(getApplicationContext(), "Could not retrieve data from server.",Toast.LENGTH_LONG);
                e.printStackTrace();
            }
            return jsonObject;
        }
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void triggerevent(final String eventname, final String eventjson) {
            new Thread(new Runnable() {
                public void run() {
                JSONObject jsonObject=null;
                SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                String serverUrl=sharedPref.getString("serverurl", "");
                serverUrl+="/triggerevent/";
                try {

                    jsonObject=new JSONObject();
                    jsonObject.put("eventname",eventname);

                    jsonObject.put("data", eventjson);

                    DefaultHttpClient defaultClient = new DefaultHttpClient();
                    HttpPost httpPost=new HttpPost(serverUrl);
                    httpPost.setEntity(new StringEntity(jsonObject.toString(), "UTF8"));
                    httpPost.setHeader("Content-type", "application/json");

                    HttpResponse httpResponse = defaultClient.execute(httpPost);
                    BufferedReader reader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));

                }catch (Exception e){
                    //Toast.makeText(getApplicationContext(), "Could not retrieve data from server.",Toast.LENGTH_LONG);
                    e.printStackTrace();
                }
                }
            }).start();
        }

        @JavascriptInterface
        public void vibrate() {
            new Thread(new Runnable() {
                public void run() {
                    Vibrator v = (Vibrator) getApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
                    v.vibrate(500);
                }
            }).start();
        }
    }
}